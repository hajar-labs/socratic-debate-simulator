// App-wide constants
// Centralizes configuration values and constants used throughout the application

const constants = {
  // Debate formats as mentioned in design document
  DEBATE_FORMATS: {
    STANDARD: 'standard',
    OXFORD: 'oxford',
    SOCRATIC: 'socratic',
  },
  
  // Claim types for argument structure visualization (color-coding)
  CLAIM_TYPES: {
    FACTUAL: 'factual',
    INTERPRETIVE: 'interpretive',
    PREDICTIVE: 'predictive',
    NORMATIVE: 'normative',
  },
  
  // Evidence types for the Evidence Panel
  EVIDENCE_TYPES: {
    PRIMARY_RESEARCH: 'primary_research',
    EXPERT_OPINION: 'expert_opinion',
    STATISTICAL: 'statistical',
    ANECDOTAL: 'anecdotal',
    HISTORICAL: 'historical',
  },
  
  // User interaction types from the design document
  INTERACTION_TYPES: {
    ASK_FOLLOWUP: 'ask_followup',
    CHALLENGE_ASSUMPTION: 'challenge_assumption',
    REQUEST_EVIDENCE: 'request_evidence',
    STEELMAN: 'steelman_position',
    INTRODUCE_CONSIDERATION: 'introduce_consideration',
  },
  
  // Debate parameter controls from design document
  DEBATE_PARAMETERS: {
    DEPTH_VS_BREADTH: 'depth_vs_breadth',
    TECHNICAL_LEVEL: 'technical_level',
    EMPHASIS: 'emphasis',
    TIME_CONSTRAINT: 'time_constraint',
  },
  
  // Emphasis types for debate parameter controls
  EMPHASIS_TYPES: {
    ETHICAL: 'ethical',
    PRACTICAL: 'practical',
    THEORETICAL: 'theoretical',
  },
  
  // Animation durations (in ms) 
  ANIMATIONS: {
    EXPERT_FADE: 400,  // From design document
    ARGUMENT_TRANSITION: 300,
    EVIDENCE_PANEL_SLIDE: 250,
    TOOLTIP_FADE: 200,
  },
  
  // Maximum limits
  LIMITS: {
    MAX_EXPERTS: 4,
    MAX_SUGGESTED_TOPICS: 5,
    MAX_SUGGESTED_FOLLOW_UPS: 3,
  },
  
  // API endpoints (to be replaced with actual endpoints)
  API: {
    GENERATE_DEBATE: '/api/debate/generate',
    GET_EXPERTS: '/api/experts',
    GET_EVIDENCE: '/api/evidence',
    SUBMIT_INTERACTION: '/api/interaction',
    GET_SUGGESTIONS: '/api/suggestions',
  },
  
  // Local storage keys
  STORAGE_KEYS: {
    USER_PREFERENCES: 'socratic_debate_user_prefs',
    RECENT_TOPICS: 'socratic_debate_recent_topics',
    SAVED_DEBATES: 'socratic_debate_saved_debates',
  },
  
  // Default values
  DEFAULTS: {
    TECHNICAL_LEVEL: 2, // On a scale of 1-5
    DEBATE_FORMAT: 'standard',
    NUM_EXPERTS: 3,
  },
};

export default constants;