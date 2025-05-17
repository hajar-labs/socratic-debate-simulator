import React, { useEffect, useState } from 'react';
import { getRelevantExperts } from '../../data/experts';
import ExpertCard from './ExpertCard';
import './ExpertSelection.css';

const ExpertSelection = ({ onExpertsChange, selectedExperts, topic }) => {
  const [availableExperts, setAvailableExperts] = useState([]);
  const [suggestedCombinations, setSuggestedCombinations] = useState([]);
  
  useEffect(() => {
    if (topic) {
      const experts = getRelevantExperts(topic);
      setAvailableExperts(experts);
      
      // Generate suggested combinations (in a real app, this would be more sophisticated)
      if (experts.length >= 4) {
        setSuggestedCombinations([
          {
            name: "Balanced Viewpoints",
            experts: [experts[0].id, experts[1].id, experts[2].id, experts[3].id]
          },
          {
            name: "Contrasting Perspectives",
            experts: [experts[0].id, experts[3].id, experts[5].id, experts[7].id]
          }
        ]);
      }
    }
  }, [topic]);
  
  const toggleExpert = (expertId) => {
    if (selectedExperts.includes(expertId)) {
      onExpertsChange(selectedExperts.filter(id => id !== expertId));
    } else if (selectedExperts.length < 4) {
      onExpertsChange([...selectedExperts, expertId]);
    }
  };
  
  const selectCombination = (expertIds) => {
    onExpertsChange(expertIds);
  };
  
  return (
    <div className="expert-selection">
      {suggestedCombinations.length > 0 && (
        <div className="suggested-combinations">
          <h3>Suggested Combinations</h3>
          <div className="combinations-list">
            {suggestedCombinations.map((combo, index) => (
              <button 
                key={index}
                className="combination-button"
                onClick={() => selectCombination(combo.experts)}
              >
                {combo.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="experts-grid">
        {availableExperts.map(expert => (
          <ExpertCard
            key={expert.id}
            expert={expert}
            isSelected={selectedExperts.includes(expert.id)}
            onSelect={() => toggleExpert(expert.id)}
          />
        ))}
      </div>
      
      <div className="selection-info">
        {selectedExperts.length === 0 ? (
          <p>Select 2-4 experts to participate in the debate</p>
        ) : (
          <p>Selected: {selectedExperts.length} of 4 experts</p>
        )}
      </div>
    </div>
  );
};

export default ExpertSelection;