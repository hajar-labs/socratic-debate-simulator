// src/components/debate/EvidencePanel.js
import React from 'react';
import '../../assets/styles/EvidencePanel.css';

const EvidencePanel = ({ evidence, onClose }) => {
  if (!evidence || evidence.length === 0) {
    return null;
  }
  
  const getEvidenceTypeIcon = (type) => {
    switch (type) {
      case 'research':
        return '📊'; // Research paper icon
      case 'statistics':
        return '📈'; // Statistics icon
      case 'expert_opinion':
        return '👩‍🏫'; // Expert icon
      case 'case_study':
        return '📋'; // Case study icon
      default:
        return '📄'; // Default document icon
    }
  };
  
  const getCredibilityLevel = (score) => {
    if (score >= 0.9) return 'Very High';
    if (score >= 0.7) return 'High';
    if (score >= 0.5) return 'Moderate';
    if (score >= 0.3) return 'Low';
    return 'Very Low';
  };
  
  const getCredibilityColor = (score) => {
    if (score >= 0.8) return '#7CB342'; // Green for high credibility
    if (score >= 0.6) return '#FFC107'; // Amber for moderate credibility
    if (score >= 0.4) return '#FF9800'; // Orange for questionable credibility
    return '#E74C3C'; // Red for low credibility
  };
  
  return (
    <div className="evidence-panel">
      <div className="evidence-panel-header">
        <h3>Supporting Evidence</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="evidence-panel-content">
        {evidence.map((item, index) => (
          <div key={index} className="evidence-card">
            <div className="evidence-type-icon">
              {getEvidenceTypeIcon(item.type)}
            </div>
            
            <div className="evidence-details">
              <h4 className="evidence-title">
                {item.type === 'research' ? 'Research Publication' :
                 item.type === 'statistics' ? 'Statistical Evidence' :
                 item.type === 'expert_opinion' ? 'Expert Opinion' :
                 item.type === 'case_study' ? 'Case Study' : 'Evidence'}
              </h4>
              
              <p className="evidence-content">{item.content}</p>
              
              {item.citation && (
                <div className="evidence-citation">
                  <cite>Source: {item.citation}</cite>
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="citation-link"
                    >
                      View Source
                    </a>
                  )}
                </div>
              )}
              
              {item.credibility !== undefined && (
                <div className="evidence-credibility">
                  <div className="credibility-label">
                    Source Credibility: 
                    <span style={{ color: getCredibilityColor(item.credibility) }}>
                      {getCredibilityLevel(item.credibility)}
                    </span>
                  </div>
                  <div className="credibility-bar">
                    <div 
                      className="credibility-fill"
                      style={{ 
                        width: `${item.credibility * 100}%`,
                        backgroundColor: getCredibilityColor(item.credibility)
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidencePanel;