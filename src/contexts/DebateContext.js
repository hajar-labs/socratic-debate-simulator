import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import debateService from '../services/debateService';
import analyticsService from '../services/analyticsService';
import { getUserPreferences } from '../services/userPreferences';

// Initial state for the debate context
const initialState = {
  currentDebate: null,
  experts: [],
  loading: false,
  error: null,
  arguments: [],
  selectedArgument: null,
  evidencePanelOpen: false,
  selectedEvidence: null,
  debateFormat: 'standard', // standard, oxford, socratic
  debateParameters: {
    depth: 0.5, // 0 to 1, balancing depth vs breadth
    technicalLevel: 'medium', // beginner, medium, expert
    emphasis: ['ethical', 'practical'] // ethical, practical, theoretical, historical
  },
  takeaways: null
};

// Actions
export const DEBATE_ACTIONS = {
  START_LOADING: 'START_LOADING',
  LOAD_DEBATE_SUCCESS: 'LOAD_DEBATE_SUCCESS',
  LOAD_DEBATE_ERROR: 'LOAD_DEBATE_ERROR',
  SET_EXPERTS: 'SET_EXPERTS',
  SELECT_ARGUMENT: 'SELECT_ARGUMENT',
  TOGGLE_EVIDENCE_PANEL: 'TOGGLE_EVIDENCE_PANEL',
  SELECT_EVIDENCE: 'SELECT_EVIDENCE',
  UPDATE_DEBATE_PARAMETERS: 'UPDATE_DEBATE_PARAMETERS',
  ASK_FOLLOWUP_QUESTION: 'ASK_FOLLOWUP_QUESTION',
  ADD_ARGUMENT: 'ADD_ARGUMENT',
  UPDATE_DEBATE_FORMAT: 'UPDATE_DEBATE_FORMAT',
  GENERATE_TAKEAWAYS: 'GENERATE_TAKEAWAYS',
  SET_TAKEAWAYS: 'SET_TAKEAWAYS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
const debateReducer = (state, action) => {
  switch (action.type) {
    case DEBATE_ACTIONS.START_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case DEBATE_ACTIONS.LOAD_DEBATE_SUCCESS:
      return {
        ...state,
        currentDebate: action.payload,
        arguments: action.payload.arguments || [],
        loading: false,
        error: null
      };
    
    case DEBATE_ACTIONS.LOAD_DEBATE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case DEBATE_ACTIONS.SET_EXPERTS:
      return {
        ...state,
        experts: action.payload
      };
    
    case DEBATE_ACTIONS.SELECT_ARGUMENT:
      return {
        ...state,
        selectedArgument: action.payload,
        // Close evidence panel if we're changing arguments
        evidencePanelOpen: state.selectedArgument?.id === action.payload?.id 
          ? state.evidencePanelOpen 
          : false,
        selectedEvidence: state.selectedArgument?.id === action.payload?.id 
          ? state.selectedEvidence 
          : null
      };
    
    case DEBATE_ACTIONS.TOGGLE_EVIDENCE_PANEL:
      return {
        ...state,
        evidencePanelOpen: action.payload !== undefined ? action.payload : !state.evidencePanelOpen
      };
    
    case DEBATE_ACTIONS.SELECT_EVIDENCE:
      return {
        ...state,
        selectedEvidence: action.payload,
        evidencePanelOpen: action.payload !== null
      };
    
    case DEBATE_ACTIONS.UPDATE_DEBATE_PARAMETERS:
      return {
        ...state,
        debateParameters: {
          ...state.debateParameters,
          ...action.payload
        }
      };
    
    case DEBATE_ACTIONS.ADD_ARGUMENT:
      return {
        ...state,
        arguments: [...state.arguments, action.payload],
        // Select the new argument
        selectedArgument: action.payload
      };
    
    case DEBATE_ACTIONS.UPDATE_DEBATE_FORMAT:
      return {
        ...state,
        debateFormat: action.payload
      };
    
    case DEBATE_ACTIONS.GENERATE_TAKEAWAYS:
      return {
        ...state,
        loading: true
      };
    
    case DEBATE_ACTIONS.SET_TAKEAWAYS:
      return {
        ...state,
        takeaways: action.payload,
        loading: false
      };
    
    case DEBATE_ACTIONS.RESET_STATE:
      return {
        ...initialState,
        // Keep experts list
        experts: state.experts
      };
    
    default:
      return state;
  }
};

// Create the context
export const DebateContext = createContext();

// Context provider component
export const DebateContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(debateReducer, initialState);
  const params = useParams();
  const navigate = useNavigate();
  
  // Load user preferences on mount
  useEffect(() => {
    try {
      const userPrefs = getUserPreferences();
      
      // Set debate format from user preferences if available
      if (userPrefs.debateFormat) {
        dispatch({
          type: DEBATE_ACTIONS.UPDATE_DEBATE_FORMAT,
          payload: userPrefs.debateFormat
        });
      }
      
      // Set debate parameters from user preferences if available
      if (userPrefs.technicalLevel || userPrefs.focusAreas) {
        dispatch({
          type: DEBATE_ACTIONS.UPDATE_DEBATE_PARAMETERS,
          payload: {
            technicalLevel: userPrefs.technicalLevel || state.debateParameters.technicalLevel,
            emphasis: userPrefs.focusAreas || state.debateParameters.emphasis
          }
        });
      }
    } catch (error) {
      console.error('Error loading user preferences for debate:', error);
    }
  }, []);
  
  // Load debate if debateId is in the URL
  useEffect(() => {
    if (params.debateId) {
      loadDebate(params.debateId);
    }
  }, [params.debateId]);
  
  // Load a debate by ID
  const loadDebate = async (debateId) => {
    if (!debateId) return;
    
    dispatch({ type: DEBATE_ACTIONS.START_LOADING });
    
    try {
      const debate = await debateService.getDebateById(debateId);
      
      dispatch({
        type: DEBATE_ACTIONS.LOAD_DEBATE_SUCCESS,
        payload: debate
      });
      
      // Track debate view
      analyticsService.trackDebateEvent(
        analyticsService.ANALYTICS_EVENTS.DEBATE_STARTED,
        debateId,
        {
          topic: debate.topic,
          format: debate.format,
          expertCount: debate.experts?.length || 0
        }
      );
      
      // Load experts if needed
      if (debate.experts && debate.experts.length > 0) {
        dispatch({
          type: DEBATE_ACTIONS.SET_EXPERTS,
          payload: debate.experts
        });
      }
      
      return debate;
    } catch (error) {
      dispatch({
        type: DEBATE_ACTIONS.LOAD_DEBATE_ERROR,
        payload: error.message
      });
      
      console.error('Error loading debate:', error);
      return null;
    }
  };
  
  // Start a new debate
  const startNewDebate = async (topic, selectedExperts, format = state.debateFormat) => {
    dispatch({ type: DEBATE_ACTIONS.START_LOADING });
    
    try {
      const newDebate = await debateService.createDebate({
        topic,
        experts: selectedExperts,
        format,
        parameters: state.debateParameters
      });
      
      dispatch({
        type: DEBATE_ACTIONS.LOAD_DEBATE_SUCCESS,
        payload: newDebate
      });
      
      // Track debate creation
      analyticsService.trackDebateEvent(
        analyticsService.ANALYTICS_EVENTS.DEBATE_STARTED,
        newDebate.id,
        {
          topic: newDebate.topic,
          format: newDebate.format,
          expertCount: newDebate.experts?.length || 0,
          isNew: true
        }
      );
      
      // Navigate to the new debate
      navigate(`/debate/${newDebate.id}`);
      
      return newDebate;
    } catch (error) {
      dispatch({
        type: DEBATE_ACTIONS.LOAD_DEBATE_ERROR,
        payload: error.message
      });
      
      console.error('Error creating debate:', error);
      return null;
    }
  };
  
  // Select an argument
  const selectArgument = (argument) => {
    dispatch({
      type: DEBATE_ACTIONS.SELECT_ARGUMENT,
      payload: argument
    });
    
    if (argument) {
      analyticsService.trackContentEngagement('argument', argument.id, {
        type: 'select',
        expertId: argument.expertId
      });
    }
  };
  
  // Toggle evidence panel
  const toggleEvidencePanel = (isOpen) => {
    dispatch({
      type: DEBATE_ACTIONS.TOGGLE_EVIDENCE_PANEL,
      payload: isOpen
    });
    
    if (isOpen && state.selectedArgument) {
      analyticsService.trackContentEngagement('evidence_panel', state.selectedArgument.id, {
        type: 'open',
        argumentId: state.selectedArgument.id
      });
    }
  };
  
  // Select evidence to view
  const selectEvidence = (evidence) => {
    dispatch({
      type: DEBATE_ACTIONS.SELECT_EVIDENCE,
      payload: evidence
    });
    
    if (evidence) {
      analyticsService.trackContentEngagement('evidence', evidence.id, {
        type: 'view',
        argumentId: state.selectedArgument?.id
      });
    }
  };
  
  // Update debate parameters
  const updateDebateParameters = (parameters) => {
    dispatch({
      type: DEBATE_ACTIONS.UPDATE_DEBATE_PARAMETERS,
      payload: parameters
    });
    
    // If we have an active debate, update it
    if (state.currentDebate?.id) {
      debateService.updateDebateParameters(state.currentDebate.id, {
        ...state.debateParameters,
        ...parameters
      });
      
      analyticsService.trackEvent(
        analyticsService.ANALYTICS_EVENTS.SETTINGS_CHANGED,
        { parameters }
      );
    }
  };
  
  // Ask a follow-up question
  const askFollowupQuestion = async (question, targetExpertId = null) => {
    if (!state.currentDebate?.id) return null;
    
    try {
      const response = await debateService.askFollowupQuestion(
        state.currentDebate.id,
        question,
        targetExpertId
      );
      
      // Add new arguments to the state
      if (response.arguments && response.arguments.length > 0) {
        response.arguments.forEach(argument => {
          dispatch({
            type: DEBATE_ACTIONS.ADD_ARGUMENT,
            payload: argument
          });
        });
      }
      
      analyticsService.trackEvent(
        analyticsService.ANALYTICS_EVENTS.QUESTION_ASKED,
        {
          debateId: state.currentDebate.id,
          question,
          targetExpertId
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error asking follow-up question:', error);
      return null;
    }
  };
  
  // Update debate format
  const updateDebateFormat = (format) => {
    dispatch({
      type: DEBATE_ACTIONS.UPDATE_DEBATE_FORMAT,
      payload: format
    });
    
    // If we have an active debate, update it
    if (state.currentDebate?.id) {
      debateService.updateDebateFormat(state.currentDebate.id, format);
    }
  };
  
  // Generate takeaways from the debate
  const generateTakeaways = async () => {
    if (!state.currentDebate?.id) return null;
    
    dispatch({ type: DEBATE_ACTIONS.GENERATE_TAKEAWAYS });
    
    try {
      const takeaways = await debateService.generateTakeaways(state.currentDebate.id);
      
      dispatch({
        type: DEBATE_ACTIONS.SET_TAKEAWAYS,
        payload: takeaways
      });
      
      analyticsService.trackEvent(
        analyticsService.ANALYTICS_EVENTS.TAKEAWAY_GENERATED,
        {
          debateId: state.currentDebate.id,
          takeawayCount: Object.keys(takeaways).reduce(
            (count, key) => count + takeaways[key].length,
            0
          )
        }
      );
      
      return takeaways;
    } catch (error) {
      dispatch({
        type: DEBATE_ACTIONS.LOAD_DEBATE_ERROR,
        payload: error.message
      });
      console.error('Error generating takeaways:', error);
      return null;
    }
  };
  
  // Reset the state
  const resetState = () => {
    dispatch({ type: DEBATE_ACTIONS.RESET_STATE });
  };
  
  // Value to be provided by the context
  const contextValue = {
    ...state,
    loadDebate,
    startNewDebate,
    selectArgument,
    toggleEvidencePanel,
    selectEvidence,
    updateDebateParameters,
    askFollowupQuestion,
    updateDebateFormat,
    generateTakeaways,
    resetState
  };
  
  return (
    <DebateContext.Provider value={contextValue}>
      {children}
    </DebateContext.Provider>
  );
};

// Custom hook for using the debate context
export const useDebateContext = () => {
  const context = useContext(DebateContext);
  
  if (!context) {
    throw new Error('useDebateContext must be used within a DebateContextProvider');
  }
  
  return context;
};

export default { DebateContextProvider, useDebateContext };