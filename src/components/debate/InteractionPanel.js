// src/components/debate/InteractionPanel.js
import React, { useState } from 'react';
import '../../assets/styles/InteractionPanel.css';
import { 
  askFollowUpQuestion, 
  challengeAssumption, 
  requestEvidence, 
  generateSteelmanArgument, 
  introduceNewConsideration 
} from '../../services/debateService';

const InteractionPanel = ({ debate, currentStage, onAskQuestion, topic }) => {
  const [activeTab, setActiveTab] = useState('follow-up');
  const [question, setQuestion] = useState('');
  const [challenge, setChallenge] = useState('');
  const [consideration, setConsideration] = useState('');
  const [selectedArgument, setSelectedArgument] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResponse(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    
    try {
      let result;
      
      switch (activeTab) {
        case 'follow-up':
          result = await askFollowUpQuestion(debate.id, question);
          setQuestion('');
          break;
        case 'challenge':
          result = await challengeAssumption(debate.id, selectedArgument, challenge);
          setChallenge('');
          break;
        case 'evidence':
          result = await requestEvidence(debate.id, selectedArgument);
          break;
        case 'steelman':
          result = await generateSteelmanArgument(debate.id, selectedArgument);
          break;
        case 'new-consideration':
          result = await introduceNewConsideration(debate.id, consideration);
          setConsideration('');
          break;
        default:
          throw new Error('Unknown interaction type');
      }
      
      setResponse(result);
      
      if (onAskQuestion && activeTab === 'follow-up') {
        onAskQuestion(question);
      }
      
    } catch (error) {
      console.error('Error during interaction:', error);
      setResponse({
        error: true,
        message: 'There was an error processing your request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get current arguments for selection
  const getCurrentArguments = () => {
    if (!debate || !debate.stages || !debate.stages[currentStage]) return [];
    
    const currentStageData = debate.stages[currentStage];
    if (!currentStageData.arguments) return [];
    
    return currentStageData.arguments.map(argId => {
      const arg = debate.arguments[argId];
      return { id: argId, content: arg ? arg.content : 'Unknown argument' };
    });
  };
  
  // Generate smart suggestions based on the current debate state
  const getSuggestions = () => {
    if (!debate || !debate.stages || !debate.stages[currentStage]) return [];
    
    const currentStageData = debate.stages[currentStage];
    const suggestions = [];
    
    if (currentStageData.type === 'statement') {
      suggestions.push(`How does this view on ${topic} address potential counterarguments?`);
      suggestions.push(`What evidence exists to support this position on ${topic}?`);
    } else if (currentStageData.type === 'exchange') {
      suggestions.push(`How would you reconcile these different perspectives on ${topic}?`);
      suggestions.push(`What implications does this disagreement have for practical applications?`);
    } else if (currentStageData.type === 'closing') {
      suggestions.push(`What remaining questions need to be addressed about ${topic}?`);
      suggestions.push(`How might these insights on ${topic} be applied in real-world scenarios?`);
    }
    
    // Add some general suggestions
    suggestions.push(`Could you elaborate on the ethical implications of this perspective?`);
    suggestions.push(`How would this approach affect different stakeholders?`);
    
    // Return a subset of suggestions
    return suggestions.slice(0, 3);
  };
  
  return (
    <div className="interaction-panel">
      <div className="panel-tabs">
        <button 
          className={`tab-button ${activeTab === 'follow-up' ? 'active' : ''}`}
          onClick={() => handleTabChange('follow-up')}
        >
          Ask Follow-Up
        </button>
        <button 
          className={`tab-button ${activeTab === 'challenge' ? 'active' : ''}`}
          onClick={() => handleTabChange('challenge')}
        >
          Challenge Assumption
        </button>
        <button 
          className={`tab-button ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => handleTabChange('evidence')}
        >
          Request Evidence
        </button>
        <button 
          className={`tab-button ${activeTab === 'steelman' ? 'active' : ''}`}
          onClick={() => handleTabChange('steelman')}
        >
          Steelman Position
        </button>
        <button 
          className={`tab-button ${activeTab === 'new-consideration' ? 'active' : ''}`}
          onClick={() => handleTabChange('new-consideration')}
        >
          New Consideration
        </button>
      </div>
      
      <div className="panel-content">
        <form onSubmit={handleSubmit}>
          {activeTab === 'follow-up' && (
            <div className="input-section">
              <label htmlFor="question">Ask a follow-up question:</label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question..."
                required
              />
              <div className="suggestions">
                <p>Suggested questions:</p>
                <ul>
                  {getSuggestions().map((suggestion, index) => (
                    <li key={index} onClick={() => setQuestion(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'challenge' && (
            <div className="input-section">
              <label htmlFor="argument-select">Select an argument to challenge:</label>
              <select
                id="argument-select"
                value={selectedArgument}
                onChange={(e) => setSelectedArgument(e.target.value)}
                required
              >
                <option value="">-- Select an argument --</option>
                {getCurrentArguments().map(arg => (
                  <option key={arg.id} value={arg.id}>
                    {arg.content.substring(0, 60)}...
                  </option>
                ))}
              </select>
              
              <label htmlFor="challenge">Your challenge:</label>
              <textarea
                id="challenge"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Explain why you think this assumption may be flawed..."
                required
              />
            </div>
          )}
          
          {activeTab === 'evidence' && (
            <div className="input-section">
              <label htmlFor="evidence-argument-select">Select an argument to request evidence for:</label>
              <select
                id="evidence-argument-select"
                value={selectedArgument}
                onChange={(e) => setSelectedArgument(e.target.value)}
                required
              >
                <option value="">-- Select an argument --</option>
                {getCurrentArguments().map(arg => (
                  <option key={arg.id} value={arg.id}>
                    {arg.content.substring(0, 60)}...
                  </option>
                ))}
              </select>
              <p className="helper-text">
                Request additional sources and evidence to support or contextualize this claim.
              </p>
            </div>
          )}
          
          {activeTab === 'steelman' && (
            <div className="input-section">
              <label htmlFor="steelman-argument-select">Select an argument to strengthen:</label>
              <select
                id="steelman-argument-select"
                value={selectedArgument}
                onChange={(e) => setSelectedArgument(e.target.value)}
                required
              >
                <option value="">-- Select an argument --</option>
                {getCurrentArguments().map(arg => (
                  <option key={arg.id} value={arg.id}>
                    {arg.content.substring(0, 60)}...
                  </option>
                ))}
              </select>
              <p className="helper-text">
                The system will reformulate this argument in its strongest possible form, addressing potential weaknesses.
              </p>
            </div>
          )}
          
          {activeTab === 'new-consideration' && (
            <div className="input-section">
              <label htmlFor="consideration">Introduce a new consideration:</label>
              <textarea
                id="consideration"
                value={consideration}
                onChange={(e) => setConsideration(e.target.value)}
                placeholder="Introduce a perspective or factor that hasn't been considered yet..."
                required
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        
        {response && (
          <div className={`response-section ${response.error ? 'error' : ''}`}>
            <h4>Response:</h4>
            {response.error ? (
              <p className="error-message">{response.message}</p>
            ) : (
              <div className="response-content">
                {activeTab === 'follow-up' && (
                  <p>{response.response}</p>
                )}
                
                {activeTab === 'challenge' && (
                  <p>{response.response}</p>
                )}
                
                {activeTab === 'evidence' && (
                  <div className="evidence-list">
                    {response.evidence.map((item, index) => (
                      <div key={index} className="evidence-item">
                        <span className="evidence-type">[{item.type}]</span>
                        <p>{item.content}</p>
                        <cite>{item.citation}</cite>
                        <div className="credibility-meter">
                          <div 
                            className="credibility-fill"
                            style={{ width: `${item.credibility * 100}%` }}
                          ></div>
                          <span className="credibility-label">Source Credibility</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'steelman' && (
                  <div className="steelman-result">
                    <h5>Strengthened Argument:</h5>
                    <p>{response.steelmanArgument.content}</p>
                  </div>
                )}
                
                {activeTab === 'new-consideration' && (
                  <div className="consideration-result">
                    <p>{response.response}</p>
                    <div className="relevance-meter">
                      <div 
                        className="relevance-fill"
                        style={{ width: `${response.relevance * 100}%` }}
                      ></div>
                      <span className="relevance-label">Relevance to Debate</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionPanel;