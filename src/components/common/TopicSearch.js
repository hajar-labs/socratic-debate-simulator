import React, { useState, useEffect } from 'react';
import './TopicSearch.css';

const suggestedTopics = [
  "Should AI development be regulated?",
  "Is universal basic income a good solution to automation?",
  "Should social media platforms be responsible for misinformation?",
  "Is nuclear energy the solution to climate change?",
  "Should gene editing in humans be permitted?"
];

const TopicSearch = ({ onTopicChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  useEffect(() => {
    if (inputValue.length > 2) {
      // In a real app, this would be an API call to get topic suggestions
      const filtered = suggestedTopics.filter(topic => 
        topic.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onTopicChange(inputValue);
    }
  };
  
  const selectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    onTopicChange(suggestion);
    setSuggestions([]);
  };
  
  return (
    <div className="topic-search">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Enter a debate topic or question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="search-button">
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </form>
      
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      <div className="popular-topics">
        <h3>Popular Topics</h3>
        <div className="topic-tags">
          {suggestedTopics.slice(0, 3).map((topic, index) => (
            <button
              key={index}
              className="topic-tag"
              onClick={() => selectSuggestion(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicSearch;