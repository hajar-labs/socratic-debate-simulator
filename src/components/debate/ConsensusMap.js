import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import theme from '../../config/theme';
import constants from '../../config/constants';

/**
 * ConsensusMap component for visualizing areas of agreement and disagreement
 * Uses Venn diagram-style visualization as specified in the design document
 */
const ConsensusMap = ({ 
  experts, 
  debateData,
  onPointClick,
  highlightedPoint = null,
}) => {
  const [consensusPoints, setConsensusPoints] = useState([]);
  const [disagreementPoints, setDisagreementPoints] = useState([]);
  const [mapLayout, setMapLayout] = useState(null);
  const canvasRef = useRef(null);
  
  // Process debate data to identify consensus and disagreement points
  useEffect(() => {
    if (!debateData || !experts || experts.length === 0) return;
    
    // In a real implementation, this would use more sophisticated algorithm
    // to identify points of consensus and disagreement from debate data
    
    // For demonstration, we'll create some sample points
    const consensusData = debateData.arguments
      .filter(arg => arg.agreementLevel > 0.7)
      .map(arg => ({
        id: arg.id,
        text: arg.text,
        supportingExperts: arg.supportedBy,
        strength: arg.agreementLevel,
        type: arg.claimType,
      }));
      
    const disagreementData = debateData.arguments
      .filter(arg => arg.agreementLevel < 0.4)
      .map(arg => ({
        id: arg.id,
        text: arg.text,
        proposedBy: arg.proposedBy,
        opposedBy: arg.opposedBy,
        strength: 1 - arg.agreementLevel,
        type: arg.claimType,
      }));
    
    setConsensusPoints(consensusData);
    setDisagreementPoints(disagreementData);
    
    // Calculate the map layout based on expert positions
    calculateMapLayout(experts);
  }, [debateData, experts]);
  
  // Calculate the layout for the Venn diagram based on expert relationships
  const calculateMapLayout = (experts) => {
    if (!experts || experts.length < 2) return null;
    
    // Calculate center positions for each expert's circle
    // In a real implementation, this would use agreement data to position experts
    // For now, we'll create a simple circular layout
    
    const centerX = 400;
    const centerY = 300;
    const radius = Math.min(experts.length === 2 ? 120 : 150, 180);
    
    const positions = {};
    
    experts.forEach((expert, index) => {
      const angle = (2 * Math.PI * index) / experts.length - Math.PI / 2;
      positions[expert.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        // Circle radius should be based on expert's contribution to the debate
        radius: 120, 
        color: getExpertColor(index),
      };
    });
    
    // Calculate intersection areas (simplified version)
    const intersections = [];
    for (let i = 0; i < experts.length; i++) {
      for (let j = i + 1; j < experts.length; j++) {
        const expert1 = experts[i];
        const expert2 = experts[j];
        const pos1 = positions[expert1.id];
        const pos2 = positions[expert2.id];
        
        // Calculate center point of intersection
        intersections.push({
          experts: [expert1.id, expert2.id],
          centerX: (pos1.x + pos2.x) / 2,
          centerY: (pos1.y + pos2.y) / 2,
        });
      }
    }
    
    // For 3+ experts, calculate the center point of all experts
    let centerIntersection = null;
    if (experts.length >= 3) {
      centerIntersection = {
        experts: experts.map(e => e.id),
        centerX,
        centerY,
      };
    }
    
    setMapLayout({
      expertPositions: positions,
      pairwiseIntersections: intersections,
      centerIntersection,
      width: centerX * 2,
      height: centerY * 2,
    });
  };
  
  // Helper to get a color for each expert
  const getExpertColor = (index) => {
    const colors = [
      theme.colors.amberAccent, 
      theme.colors.sageGreen, 
      theme.colors.coralRed,
      '#5DADE2' // Additional color for a 4th expert
    ];
    return colors[index % colors.length];
  };
  
  // Get claim type color
  const getClaimTypeColor = (type) => {
    const colors = {
      [constants.CLAIM_TYPES.FACTUAL]: '#4CAF50',
      [constants.CLAIM_TYPES.INTERPRETIVE]: '#2196F3',
      [constants.CLAIM_TYPES.PREDICTIVE]: '#9C27B0',
      [constants.CLAIM_TYPES.NORMATIVE]: '#FF9800',
    };
    return colors[type] || '#757575';
  };
  
  // Draw the Venn diagram on canvas
  useEffect(() => {
    if (!mapLayout || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = mapLayout.width;
    canvas.height = mapLayout.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw expert circles with transparency
    Object.entries(mapLayout.expertPositions).forEach(([expertId, position]) => {
      ctx.beginPath();
      ctx.arc(position.x, position.y, position.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `${position.color}30`; // 30 is hex for ~19% opacity
      ctx.fill();
      ctx.strokeStyle = position.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add expert name
      const expert = experts.find(e => e.id === expertId);
      if (expert) {
        ctx.font = `${theme.typography.fontWeight.medium} ${theme.typography.fontSize.base} ${theme.typography.fontFamily.body}`;
        ctx.fillStyle = theme.colors.deepNavy;
        ctx.textAlign = 'center';
        ctx.fillText(expert.name, position.x, position.y - position.radius - 10);
      }
    });
    
    // Draw consensus points
    consensusPoints.forEach((point, index) => {
      // Position the point based on supporting experts
      let x = 0, y = 0;
      
      if (point.supportingExperts.length >= experts.length) {
        // Full consensus - place in center
        x = mapLayout.width / 2;
        y = mapLayout.height / 2;
      } else if (point.supportingExperts.length === 1) {
        // Single expert - place in their circle
        const expertPos = mapLayout.expertPositions[point.supportingExperts[0]];
        x = expertPos.x + (Math.random() * 40 - 20);
        y = expertPos.y + (Math.random() * 40 - 20);
      } else {
        // Partial consensus - place in the intersection
        const intersection = mapLayout.pairwiseIntersections.find(
          i => point.supportingExperts.every(expId => i.experts.includes(expId))
        );
        
        if (intersection) {
          x = intersection.centerX + (Math.random() * 30 - 15);
          y = intersection.centerY + (Math.random() * 30 - 15);
        } else {
          // Fallback
          x = mapLayout.width / 2 + (Math.random() * 60 - 30);
          y = mapLayout.height / 2 + (Math.random() * 60 - 30);
        }
      }
      
      // Draw the consensus point
      const radius = 8 + point.strength * 4;
      const isHighlighted = highlightedPoint === point.id;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isHighlighted 
        ? theme.colors.amberAccent 
        : getClaimTypeColor(point.type);
      ctx.fill();
      
      if (isHighlighted) {
        ctx.strokeStyle = theme.colors.deepNavy;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    
    // Similar approach for disagreement points
    // Omitted for brevity
    
  }, [mapLayout, consensusPoints, disagreementPoints, highlightedPoint, experts]);
  
  // Handle click on the canvas to detect clicked points
  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !mapLayout) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is on any consensus points
    const clickedPoint = [...consensusPoints, ...disagreementPoints].find(point => {
      // We'd need actual x,y positions stored for each point
      // This is simplified for the example
      return false; // Replace with actual hit testing
    });
    
    if (clickedPoint && onPointClick) {
      onPointClick(clickedPoint);
    }
  };
  
  return (
    <div className="consensus-map-container">
      <h3 style={{
        fontFamily: theme.typography.fontFamily.heading,
        marginBottom: theme.spacing.md,
        color: theme.colors.deepNavy,
      }}>
        Consensus & Disagreement Map
      </h3>
      
      <div className="canvas-container" style={{ position: 'relative' }}>
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            border: `1px solid ${theme.colors.lightGray}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: '#f9f9fa',
          }}
          width={800}
          height={600}
        />
        
        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: theme.spacing.md,
          right: theme.spacing.md,
          background: 'rgba(255, 255, 255, 0.8)',
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.sm,
          border: `1px solid ${theme.colors.lightGray}`,
        }}>
          <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, marginBottom: theme.spacing.xs }}>
            Claim Types
          </div>
          {Object.entries(constants.CLAIM_TYPES).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: theme.spacing.xs }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getClaimTypeColor(value),
                marginRight: theme.spacing.xs,
              }} />
              <span style={{ fontSize: theme.typography.fontSize.sm }}>{key.charAt(0) + key.slice(1).toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ConsensusMap.propTypes = {
  experts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  debateData: PropTypes.shape({
    arguments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        agreementLevel: PropTypes.number,
        supportedBy: PropTypes.arrayOf(PropTypes.string),
        opposedBy: PropTypes.arrayOf(PropTypes.string),
        proposedBy: PropTypes.string,
        claimType: PropTypes.string,
      })
    ),
  }),
  onPointClick: PropTypes.func,
  highlightedPoint: PropTypes.string,
};

export default ConsensusMap;