import React, { useState } from 'react';
import { useDebateContext } from '../../contexts/DebateContext';
import './KnowledgeSynthesis.css';

const KnowledgeSynthesis = () => {
  const { currentDebate, experts } = useDebateContext();
  const [activeView, setActiveView] = useState('consensus'); // consensus, perspectives, takeaways
  
  if (!currentDebate || !experts) {
    return <div className="knowledge-synthesis-placeholder">Select a debate topic to view synthesis</div>;
  }

  // Generate consensus data based on debate points
  const generateConsensusMap = () => {
    // This would be more sophisticated in a real implementation
    // Here we're simulating the consensus/disagreement visualization
    const consensusPoints = currentDebate.arguments.filter(arg => 
      arg.agreementLevel > 0.7
    ).map(arg => ({
      id: arg.id,
      content: arg.content,
      agreementLevel: arg.agreementLevel,
      supportingExperts: arg.supportingExperts
    }));

    const disagreementPoints = currentDebate.arguments.filter(arg => 
      arg.agreementLevel < 0.4 && arg.significance > 0.6
    ).map(arg => ({
      id: arg.id,
      content: arg.content,
      agreementLevel: arg.agreementLevel,
      opposingViewpoints: arg.opposingViewpoints
    }));

    return { consensusPoints, disagreementPoints };
  };

  // Generate perspective summaries for each expert
  const generatePerspectiveSummaries = () => {
    return experts.map(expert => {
      const keyArguments = currentDebate.arguments
        .filter(arg => arg.expertId === expert.id && arg.significance > 0.5)
        .sort((a, b) => b.significance - a.significance)
        .slice(0, 3);
        
      return {
        expertId: expert.id,
        name: expert.name,
        corePosition: expert.positions.find(p => p.topicId === currentDebate.topicId)?.summary || 'Position not available',
        keyArguments,
        primaryEvidence: currentDebate.evidence
          .filter(e => e.expertId === expert.id && e.strength > 0.7)
          .slice(0, 2),
        remainingObjections: currentDebate.objections
          .filter(o => o.targetExpertId === expert.id && !o.addressed)
      };
    });
  };

  // Generate key takeaways from the debate
  const generateTakeaways = () => {
    const { consensusPoints } = generateConsensusMap();
    
    // Find the most significant insights
    const keyInsights = currentDebate.arguments
      .filter(arg => arg.significance > 0.8)
      .sort((a, b) => b.significance - a.significance)
      .slice(0, 5)
      .map(arg => ({
        id: arg.id,
        content: arg.content,
        type: arg.type
      }));
      
    // Identify knowledge gaps
    const knowledgeGaps = currentDebate.questions
      .filter(q => !q.answered)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3);
      
    // Generate recommended resources
    const recommendedResources = currentDebate.sources
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
      
    return { keyInsights, consensusPoints, knowledgeGaps, recommendedResources };
  };

  const renderConsensusMap = () => {
    const { consensusPoints, disagreementPoints } = generateConsensusMap();
    
    return (
      <div className="consensus-map">
        <div className="consensus-section">
          <h3>Areas of Expert Agreement</h3>
          <div className="consensus-points">
            {consensusPoints.map(point => (
              <div key={point.id} className="consensus-point">
                <div className="agreement-indicator" style={{ background: `linear-gradient(90deg, #7CB342 ${point.agreementLevel * 100}%, transparent 0%)` }}></div>
                <p>{point.content}</p>
                <div className="supporting-experts">
                  {point.supportingExperts.map(expertId => {
                    const expert = experts.find(e => e.id === expertId);
                    return <span key={expertId} className="expert-tag">{expert?.name}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="disagreement-section">
          <h3>Key Points of Contention</h3>
          <div className="disagreement-points">
            {disagreementPoints.map(point => (
              <div key={point.id} className="disagreement-point">
                <div className="disagreement-indicator" style={{ background: `linear-gradient(90deg, #E74C3C ${(1 - point.agreementLevel) * 100}%, transparent 0%)` }}></div>
                <p>{point.content}</p>
                <div className="viewpoints">
                  {point.opposingViewpoints.map((viewpoint, index) => (
                    <div key={index} className="opposing-viewpoint">
                      <span className="expert-tag">{experts.find(e => e.id === viewpoint.expertId)?.name}:</span>
                      <p>{viewpoint.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPerspectiveSummaries = () => {
    const perspectives = generatePerspectiveSummaries();
    
    return (
      <div className="perspective-summaries">
        {perspectives.map(perspective => (
          <div key={perspective.expertId} className="perspective-card">
            <div className="perspective-header">
              <h3>{perspective.name}</h3>
              <div className="expertise-tags">
                {experts.find(e => e.id === perspective.expertId)?.expertise.map((area, index) => (
                  <span key={index} className="expertise-tag">{area}</span>
                ))}
              </div>
            </div>
            
            <div className="core-position">
              <h4>Core Position</h4>
              <p>{perspective.corePosition}</p>
            </div>
            
            <div className="key-arguments">
              <h4>Key Arguments</h4>
              <ul>
                {perspective.keyArguments.map(arg => (
                  <li key={arg.id}>
                    <div className="argument-strength" style={{ width: `${arg.significance * 100}%` }}></div>
                    <p>{arg.content}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="primary-evidence">
              <h4>Primary Evidence</h4>
              <ul>
                {perspective.primaryEvidence.map(evidence => (
                  <li key={evidence.id}>
                    <div className="evidence-type-tag">{evidence.type}</div>
                    <p>{evidence.content}</p>
                    <a href={evidence.source} target="_blank" rel="noopener noreferrer" className="source-link">Source</a>
                  </li>
                ))}
              </ul>
            </div>
            
            {perspective.remainingObjections.length > 0 && (
              <div className="remaining-objections">
                <h4>Unaddressed Objections</h4>
                <ul>
                  {perspective.remainingObjections.map(objection => (
                    <li key={objection.id}>{objection.content}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTakeaways = () => {
    const { keyInsights, consensusPoints, knowledgeGaps, recommendedResources } = generateTakeaways();
    
    return (
      <div className="takeaways">
        <div className="key-insights">
          <h3>Key Insights</h3>
          <ul>
            {keyInsights.map(insight => (
              <li key={insight.id} className={`insight-type-${insight.type}`}>
                {insight.content}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="actionable-considerations">
          <h3>Actionable Considerations</h3>
          <div className="considerations-list">
            {consensusPoints.slice(0, 3).map(point => (
              <div key={point.id} className="consideration-item">
                <div className="consideration-icon">✓</div>
                <p>{point.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="knowledge-gaps">
          <h3>Knowledge Gaps Identified</h3>
          <ul>
            {knowledgeGaps.map(gap => (
              <li key={gap.id}>{gap.content}</li>
            ))}
          </ul>
        </div>
        
        <div className="recommended-resources">
          <h3>Recommended Resources</h3>
          <ul className="resource-list">
            {recommendedResources.map(resource => (
              <li key={resource.id} className="resource-item">
                <div className="resource-type-icon">{resource.type === 'book' ? '📚' : resource.type === 'article' ? '📄' : '🔗'}</div>
                <div className="resource-details">
                  <h4>{resource.title}</h4>
                  <p>{resource.author} ({resource.year})</p>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">Access Resource</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="knowledge-synthesis">
      <div className="synthesis-tabs">
        <button 
          className={`tab-button ${activeView === 'consensus' ? 'active' : ''}`}
          onClick={() => setActiveView('consensus')}
        >
          Consensus Map
        </button>
        <button 
          className={`tab-button ${activeView === 'perspectives' ? 'active' : ''}`}
          onClick={() => setActiveView('perspectives')}
        >
          Perspective Summaries
        </button>
        <button 
          className={`tab-button ${activeView === 'takeaways' ? 'active' : ''}`}
          onClick={() => setActiveView('takeaways')}
        >
          Key Takeaways
        </button>
      </div>
      
      <div className="synthesis-content">
        {activeView === 'consensus' && renderConsensusMap()}
        {activeView === 'perspectives' && renderPerspectiveSummaries()}
        {activeView === 'takeaways' && renderTakeaways()}
      </div>
    </div>
  );
};

export default KnowledgeSynthesis;