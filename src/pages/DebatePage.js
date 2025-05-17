import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../assets/styles/DebatePage.css';
import experts from '../data/experts';
import DebateTheater from '../components/debate/DebateTheater';
import DebateTimeline from '../components/debate/DebateTimeline';
import InteractionPanel from '../components/debate/InteractionPanel';
import KnowledgeSynthesis from '../components/visualization/KnowledgeSynthesis';
import { generateDebate } from '../services/debateService';

const DebatePage = () => {
  const { topicId } = useParams();
  const location = useLocation();
  const [topic, setTopic] = useState('');
  const [selectedExperts, setSelectedExperts] = useState([]);
  const [debateFormat, setDebateFormat] = useState('standard');
  const [loading, setLoading] = useState(true);
  const [debate, setDebate] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  
  useEffect(() => {
    if (location.state) {
      setTopic(location.state.topic);
      setSelectedExperts(location.state.experts.map(id => 
        experts.find(expert => expert.id === id)
      ));
      setDebateFormat(location.state.format);
    } else {
      // In a real app, we would fetch this information from an API
      // using the topicId from params
      const decodedTopic = decodeURIComponent(topicId).replace(/-/g, ' ');
      setTopic(decodedTopic);
      // For demo purposes, select some default experts
      setSelectedExperts([experts[0], experts[1], experts[3]]);
    }
  }, [topicId, location.state]);
  
  useEffect(() => {
    if (topic && selectedExperts.length > 0) {
      setLoading(true);
      // In a real app, this would be an asynchronous API call
      const generatedDebate = generateDebate(topic, selectedExperts, debateFormat);
      setDebate(generatedDebate);
      setLoading(false);
    }
  }, [topic, selectedExperts, debateFormat]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Assembling experts and generating debate...</p>
      </div>
    );
  }
  
  return (
    <div className="debate-page">
      <header className="debate-header">
        <h1>{topic}</h1>
        <div className="debate-meta">
          <span className="format-badge">{debateFormat} Format</span>
          <span className="experts-count">{selectedExperts.length} Experts</span>
        </div>
      </header>
      
      <main className="debate-content">
        <DebateTheater 
          experts={selectedExperts} 
          debate={debate}
          currentStage={currentStage}
        />
        
        <DebateTimeline 
          debate={debate}
          currentStage={currentStage}
          onStageSelect={setCurrentStage}
        />
        
        <div className="interaction-container">
          <InteractionPanel 
            debate={debate}
            currentStage={currentStage}
            onAskQuestion={(question) => {
              // In a real app, this would trigger an API call to generate a response
              console.log("Question asked:", question);
            }}
            topic={topic}
          />
        </div>
      </main>
      
      <section className="knowledge-synthesis-section">
        <h2>Knowledge Synthesis</h2>
        <KnowledgeSynthesis debate={debate} experts={selectedExperts} />
      </section>
    </div>
  );
};

export default DebatePage;