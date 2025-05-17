import React from 'react';
import './FormatSelection.css';

const formatOptions = [
  {
    id: 'standard',
    name: 'Standard Debate',
    description: 'Opening statements, rebuttals, and closing arguments with moderated cross-examination.',
    duration: 'Medium'
  },
  {
    id: 'oxford',
    name: 'Oxford Style',
    description: 'Formal structure with proposition and opposition, aimed at persuading the audience.',
    duration: 'Long'
  },
  {
    id: 'socratic',
    name: 'Socratic Dialogue',
    description: 'Collaborative exploration through questions, seeking deeper understanding rather than winning.',
    duration: 'Medium'
  },
  {
    id: 'roundtable',
    name: 'Roundtable Discussion',
    description: 'Less structured conversation with all experts contributing equally.',
    duration: 'Short'
  }
];

const FormatSelection = ({ onFormatChange, selectedFormat }) => {
  return (
    <div className="format-selection">
      <div className="format-options">
        {formatOptions.map(format => (
          <div 
            key={format.id}
            className={`format-option ${selectedFormat === format.id ? 'selected' : ''}`}
            onClick={() => onFormatChange(format.id)}
          >
            <div className="format-header">
              <h3>{format.name}</h3>
              <span className="format-duration">{format.duration}</span>
            </div>
            <p className="format-description">{format.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormatSelection;