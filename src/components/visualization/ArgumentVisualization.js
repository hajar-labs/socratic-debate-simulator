// src/components/visualization/ArgumentVisualization.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../../assets/styles/ArgumentVisualization.css';

const ArgumentVisualization = ({ debate, currentStage, onEvidenceClick }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!debate || !debate.stages || !debate.stages[currentStage] || !svgRef.current) {
      return;
    }
    
    const currentStageData = debate.stages[currentStage];
    const relevantArgumentIds = currentStageData.arguments || [];
    
    if (relevantArgumentIds.length === 0) {
      return;
    }
    
    // Collect arguments and related arguments to display
    const argumentsToShow = new Set();
    const links = [];
    
    // Add the primary arguments
    relevantArgumentIds.forEach(argId => {
      argumentsToShow.add(argId);
      
      // Add connected arguments (supports and opposes)
      const arg = debate.arguments[argId];
      if (!arg) return;
      
      // Add supporting arguments
      if (arg.supports && arg.supports.length > 0) {
        arg.supports.forEach(supportId => {
          argumentsToShow.add(supportId);
          links.push({ source: argId, target: supportId, type: 'supports' });
        });
      }
      
      // Add opposing arguments
      if (arg.opposes && arg.opposes.length > 0) {
        arg.opposes.forEach(opposeId => {
          argumentsToShow.add(opposeId);
          links.push({ source: argId, target: opposeId, type: 'opposes' });
        });
      }
      
      // Add evidence
      if (arg.evidence && arg.evidence.length > 0) {
        arg.evidence.forEach(evidenceId => {
          argumentsToShow.add(evidenceId);
          links.push({ source: argId, target: evidenceId, type: 'evidence' });
        });
      }
    });
    
    // Convert to arrays for D3
    const nodes = Array.from(argumentsToShow)
      .map(id => {
        const arg = debate.arguments[id];
        if (!arg) return null;
        
        return {
          id,
          label: arg.content ? arg.content.substring(0, 60) + (arg.content.length > 60 ? '...' : '') : 'Unknown',
          type: arg.type || 'unknown',
          strength: arg.strength || 0.5,
          isPrimary: relevantArgumentIds.includes(id),
          speaker: arg.speaker,
          evidence: arg.evidence
        };
      })
      .filter(Boolean);
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up the SVG
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Create a force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));
    
    // Draw links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', d => `link ${d.type}`)
      .attr('stroke-width', 2)
      .attr('stroke', d => {
        switch(d.type) {
          case 'supports': return '#7CB342'; // Green for support
          case 'opposes': return '#E74C3C'; // Red for opposition
          case 'evidence': return '#3498DB'; // Blue for evidence
          default: return '#95A5A6'; // Grey for default
        }
      })
      .attr('stroke-dasharray', d => d.type === 'opposes' ? '5,5' : 'none');
    
    // Create node groups
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Node circles
    node.append('circle')
      .attr('r', d => {
        if (d.type === 'evidence') return 10;
        return 20 + (d.strength || 0.5) * 10;
      })
      .attr('fill', d => {
        if (d.type === 'evidence') return '#3498DB';
        if (d.type === 'claim') return '#F39C12';
        if (d.type === 'supporting') return '#7CB342';
        if (d.type === 'counter') return '#E74C3C';
        if (d.type === 'response') return '#9B59B6';
        return '#95A5A6';
      })
      .attr('stroke', d => d.isPrimary ? '#1A2B47' : 'none')
      .attr('stroke-width', d => d.isPrimary ? 3 : 0)
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        if (d.evidence && d.evidence.length > 0 && onEvidenceClick) {
          onEvidenceClick(d.evidence);
        }
      });
    
    // Node labels
    node.append('text')
      .attr('dy', d => d.type === 'evidence' ? -15 : 30)
      .attr('text-anchor', 'middle')
      .attr('class', 'node-label')
      .text(d => {
        if (d.type === 'evidence') {
          return 'Evidence';
        }
        return d.label;
      })
      .attr('font-size', d => d.type === 'evidence' ? '10px' : '12px')
      .call(wrap, 120);
    
    // Add expert indicators for arguments
    node.filter(d => d.speaker)
      .append('circle')
      .attr('class', 'expert-indicator')
      .attr('r', 8)
      .attr('cx', 15)
      .attr('cy', -15)
      .attr('fill', d => getExpertColor(d.speaker));
    
    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Helper function to wrap text
    function wrap(text, width) {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy")) || 0;
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
    
    // Return cleanup function
    return () => {
      simulation.stop();
    };
  }, [debate, currentStage, onEvidenceClick]);
  
  return (
    <div className="argument-visualization">
      <svg ref={svgRef} className="visualization-svg"></svg>
    </div>
  );
};

// Helper function to get a consistent color for each expert
const getExpertColor = (expertId) => {
  // Simple hash function for consistent color generation
  const hash = expertId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export default ArgumentVisualization;