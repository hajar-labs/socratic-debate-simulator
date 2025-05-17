// src/components/debate/DebateTimeline.js
import React from 'react';
import '../../assets/styles/DebateTimeline.css';

const DebateTimeline = ({ debate, currentStage, onStageSelect }) => {
  if (!debate || !debate.stages || debate.stages.length === 0) {
    return <div className="debate-timeline-empty">No timeline available</div>;
  }
  
  // Group stages by type for better visual representation
  const stageGroups = [
    { type: 'introduction', label: 'Intro' },
    { type: 'statement', label: 'Openings' }, 
    { type: 'exchange', label: 'Discussion' },
    { type: 'closing', label: 'Conclusions' },
    { type: 'summary', label: 'Summary' }
  ];
  
  return (
    <div className="debate-timeline">
      <div className="timeline-track">
        {stageGroups.map((group, groupIndex) => {
          const groupStages = debate.stages.filter(stage => stage.type === group.type);
          
          if (groupStages.length === 0) return null;
          
          return (
            <div key={group.type} className="timeline-group">
              <div className="group-label">{group.label}</div>
              <div className="group-stages">
                {groupStages.map((stage, stageIndex) => {
                  const stagePosition = debate.stages.findIndex(s => s.id === stage.id);
                  const isActive = stagePosition === currentStage;
                  
                  return (
                    <div 
                      key={stage.id}
                      className={`timeline-marker ${isActive ? 'active' : ''}`}
                      onClick={() => onStageSelect(stagePosition)}
                      title={stage.title}
                    >
                      {stage.speaker && (
                        <div className="speaker-indicator" 
                             style={{ 
                               backgroundColor: getExpertColor(stage.speaker)
                             }}
                        ></div>
                      )}
                      <div className="marker-tooltip">
                        <div className="tooltip-title">{stage.title}</div>
                        {stage.speaker && (
                          <div className="tooltip-speaker">
                            {getExpertNameById(stage.speaker, debate)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="timeline-controls">
        <button 
          className="control-button"
          onClick={() => onStageSelect(Math.max(0, currentStage - 1))}
          disabled={currentStage === 0}
        >
          Previous
        </button>
        
        <div className="stage-indicator">
          Stage {currentStage + 1} of {debate.stages.length}
        </div>
        
        <button 
          className="control-button"
          onClick={() => onStageSelect(Math.min(debate.stages.length - 1, currentStage + 1))}
          disabled={currentStage === debate.stages.length - 1}
        >
          Next
        </button>
      </div>
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

// Helper function to get an expert's name by ID
const getExpertNameById = (expertId, debate) => {
  // In a real app, we would have this information directly
  // For now, we'll extract from the stages
  for (const stage of debate.stages) {
    if (stage.speaker === expertId && stage.title && stage.title.includes("'s")) {
      return stage.title.split("'s")[0];
    }
  }
  return `Expert ${expertId}`;
};

export default DebateTimeline;