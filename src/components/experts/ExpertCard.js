import React from 'react';
import './ExpertCard.css';

const ExpertCard = ({ expert, isSelected, onSelect }) => {
  return (
    <div 
      className={`expert-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="expert-avatar" style={{ backgroundImage: `url(${expert.avatar})` }}>
        {isSelected && <div className="selected-badge">✓</div>}
      </div>
      <div className="expert-info">
        <h3 className="expert-name">{expert.name}</h3>
        <p className="expert-title">{expert.title}</p>
        <div className="expert-areas">
          {expert.areas.map((area, index) => (
            <span key={index} className="area-tag">{area}</span>
          ))}
        </div>
        <p className="expert-perspective">
          {expert.perspectives[0]}
        </p>
      </div>
    </div>
  );
};

export default ExpertCard;