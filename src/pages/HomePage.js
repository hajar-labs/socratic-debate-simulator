import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HomePage.css';
import TopicSearch from '../components/common/TopicSearch';
import ExpertSelection from '../components/experts/ExpertSelection';
import FormatSelection from '../components/debate/FormatSelection';


const HomePage = () => {
  const [topic, setTopic] = useState('');
  const [selectedExperts, setSelectedExperts] = useState([]);
  const [debateFormat, setDebateFormat] = useState('standard');
  const navigate = useNavigate();
  
  const handleStartDebate = () => {
    if (topic && selectedExperts.length >= 2) {
      // In a real app, we would first create the debate in the backend
      // and then redirect to its URL with the returned ID
      const topicId = encodeURIComponent(topic.toLowerCase().replace(/\s+/g, '-'));
      navigate(`/debate/${topicId}`, {
        state: { topic, experts: selectedExperts, format: debateFormat }
      });
    }
  };
  
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Socratic</h1>
        <p className="tagline">Expert Debate Simulator</p>
      </header>
      
      <main className="content">
        <section className="topic-section">
          <h2>Enter a Topic or Question</h2>
          <TopicSearch onTopicChange={setTopic} />
        </section>
        
        <section className="experts-section">
          <h2>Select Experts</h2>
          <ExpertSelection 
            onExpertsChange={setSelectedExperts} 
            selectedExperts={selectedExperts} 
            topic={topic}
          />
        </section>
        
        <section className="format-section">
          <h2>Select Debate Format</h2>
          <FormatSelection onFormatChange={setDebateFormat} selectedFormat={debateFormat} />
        </section>
        
        <button 
          className="start-debate-button" 
          onClick={handleStartDebate}
          disabled={!topic || selectedExperts.length < 2}
        >
          Start Debate
        </button>
      </main>
    </div>
  );
};

export default HomePage;