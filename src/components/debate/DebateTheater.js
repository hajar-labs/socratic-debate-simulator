// src/components/debate/DebateTheater.js
import React, { useState, useEffect } from 'react';
import '../../assets/styles/DebateTheater.css';
import ArgumentVisualization from '../visualization/ArgumentVisualization';
import EvidencePanel from './EvidencePanel';

const DebateTheater = ({ experts, debate, currentStage }) => {
  const [activeExpert, setActiveExpert] = useState(null);
  const [showEvidencePanel, setShowEvidencePanel] = useState(false);
  const [currentEvidence, setCurrentEvidence] = useState([]);
  
  useEffect(() => {
    if (debate && debate.stages && debate.stages[currentStage]) {
      const stage = debate.stages[currentStage];
      if (stage.speaker) {
        setActiveExpert(experts.find(e => e.id === stage.speaker));
      } else {
        setActiveExpert(null);
      }
    }
  }, [currentStage, debate, experts]);
  
  const handleEvidenceClick = (evidenceIds) => {
    if (!evidenceIds || evidenceIds.length === 0) return;
    
    const evidenceItems = evidenceIds.map(id => debate.arguments[id]).filter(Boolean);
    
    if (evidenceItems.length > 0) {
      setCurrentEvidence(evidenceItems);
      setShowEvidencePanel(true);
    }
  };
  
  const closeEvidencePanel = () => {
    setShowEvidencePanel(false);
  };
  
  if (!debate || !debate.stages || debate.stages.length === 0) {
    return <div className="debate-theater-empty">No debate content available</div>;
  }
  
  const currentContent = debate.stages[currentStage];
  
  return (
    <div className="debate-theater">
      <div className="expert-positions">
        {experts.map((expert, index) => (
          <div 
            key={expert.id}
            className={`expert-avatar ${expert.id === activeExpert?.id ? 'active' : ''}`}
            style={{ 
              transform: `rotate(${(index * 360) / experts.length}deg) translate(0, -150px) rotate(-${(index * 360) / experts.length}deg)`
            }}
          >
            <div className="avatar-container">
              <img 
                src={expert.avatar} 
                alt={expert.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/experts/default-avatar.svg';
                }}
              />
              <div className="expert-name">{expert.name}</div>
            </div>
          </div>
        ))}
        
        <div className="debate-topic-center">
          <h3>{debate.topic}</h3>
        </div>
      </div>
      
      <div className="current-argument">
        <div className="speaker-info">
          {activeExpert && (
            <>
              <div className="speaker-avatar">
                <img 
                  src={activeExpert.avatar} 
                  alt={activeExpert.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/experts/default-avatar.svg';
                  }}
                />
              </div>
              <div className="speaker-details">
                <h3>{activeExpert.name}</h3>
                <p className="speaker-title">{activeExpert.title}</p>
              </div>
            </>
          )}
        </div>
        
        <div className="argument-content">
          <h4>{currentContent.title}</h4>
          <p>{currentContent.content}</p>
        </div>
        
        {currentContent.arguments && currentContent.arguments.length > 0 && (
          <div className="evidence-links">
            <button 
              className="evidence-button"
              onClick={() => handleEvidenceClick(currentContent.arguments)}
            >
              View Supporting Evidence
            </button>
          </div>
        )}
      </div>
      
      <div className="visualization-container">
        <ArgumentVisualization 
          debate={debate}
          currentStage={currentStage}
          onEvidenceClick={handleEvidenceClick}
        />
      </div>
      
      {showEvidencePanel && (
        <EvidencePanel 
          evidence={currentEvidence}
          onClose={closeEvidencePanel}
        />
      )}
    </div>
  );
};

export default DebateTheater;