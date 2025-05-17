// src/services/analyticsService.js

/**
 * Analytics Service
 * 
 * Handles tracking, analysis, and reporting of user interactions
 * and system performance metrics for the Socratic Debate Simulator.
 */

// Local storage keys
const STORAGE_KEYS = {
  USER_PREFERENCES: 'socratic_user_preferences',
  INTERACTION_HISTORY: 'socratic_interaction_history',
  SESSION_DATA: 'socratic_session_data',
};

/**
 * Initialize analytics service
 * @returns {boolean} Success status
 */
export const initAnalytics = () => {
  try {
    // Initialize session data if it doesn't exist
    if (!getSessionData()) {
      const sessionData = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        deviceInfo: getDeviceInfo(),
        interactionCount: 0,
        debatesStarted: 0,
        topicsExplored: [],
        expertInteractions: {},
      };
      
      saveSessionData(sessionData);
    }
    
    // Log initialization
    console.log('Analytics service initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize analytics service:', error);
    return false;
  }
};

/**
 * Track debate initiation
 * @param {string} topicId - Topic identifier
 * @param {string} debateId - Debate identifier
 * @param {Array} expertIds - Selected expert IDs
 * @param {string} format - Debate format (standard, oxford, socratic)
 */
export const trackDebateStart = (topicId, debateId, expertIds, format) => {
  try {
    const sessionData = getSessionData();
    if (!sessionData) return;
    
    // Update session data
    sessionData.debatesStarted += 1;
    
    // Track new topic if not previously explored
    if (!sessionData.topicsExplored.includes(topicId)) {
      sessionData.topicsExplored.push(topicId);
    }
    
    // Initialize expert interaction counters
    expertIds.forEach(expertId => {
      if (!sessionData.expertInteractions[expertId]) {
        sessionData.expertInteractions[expertId] = 0;
      }
    });
    
    // Save updated session data
    saveSessionData(sessionData);
    
    // Log debate event
    logEvent('debate_started', {
      topicId,
      debateId,
      expertIds,
      format,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track debate start:', error);
  }
};

/**
 * Track user interaction with experts
 * @param {string} debateId - Debate identifier
 * @param {string} expertId - Expert identifier
 * @param {string} interactionType - Type of interaction (question, challenge, etc.)
 */
export const trackExpertInteraction = (debateId, expertId, interactionType) => {
  try {
    const sessionData = getSessionData();
    if (!sessionData) return;
    
    // Update interaction counts
    sessionData.interactionCount += 1;
    
    // Update expert-specific interaction count
    if (sessionData.expertInteractions[expertId] !== undefined) {
      sessionData.expertInteractions[expertId] += 1;
    } else {
      sessionData.expertInteractions[expertId] = 1;
    }
    
    // Save updated session data
    saveSessionData(sessionData);
    
    // Log interaction event
    logEvent('expert_interaction', {
      debateId,
      expertId,
      interactionType,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track expert interaction:', error);
  }
};

/**
 * Track citation exploration
 * @param {string} debateId - Debate identifier
 * @param {string} citationId - Citation identifier
 * @param {string} expertId - Expert who provided the citation
 */
export const trackCitationExplored = (debateId, citationId, expertId) => {
  try {
    // Log citation event
    logEvent('citation_explored', {
      debateId,
      citationId,
      expertId,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track citation exploration:', error);
  }
};

/**
 * Track user preference settings
 * @param {Object} preferences - User preference settings
 */
export const trackUserPreferences = (preferences) => {
  try {
    // Save preferences
    saveUserPreferences(preferences);
    
    // Log preferences event
    logEvent('preferences_updated', {
      preferences,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track user preferences:', error);
  }
};

/**
 * Track debate completion
 * @param {string} debateId - Debate identifier
 * @param {number} duration - Debate duration in seconds
 * @param {number} interactionCount - Number of user interactions
 */
export const trackDebateCompletion = (debateId, duration, interactionCount) => {
  try {
    // Log completion event
    logEvent('debate_completed', {
      debateId,
      duration,
      interactionCount,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to track debate completion:', error);
  }
};

/**
 * Generate learning insights from debate interaction
 * @param {string} debateId - Debate identifier
 * @returns {Object} Learning insights data
 */
export const generateLearningInsights = (debateId) => {
  try {
    const sessionData = getSessionData();
    if (!sessionData) return null;
    
    // Get interaction history
    const interactionHistory = getInteractionHistory();
    
    // Filter interactions for this debate
    const debateInteractions = interactionHistory.filter(
      event => event.data.debateId === debateId
    );
    
    // Analyze interaction patterns
    const expertInteractions = {};
    const interactionTypes = {};
    
    debateInteractions.forEach(event => {
      if (event.type === 'expert_interaction') {
        const { expertId, interactionType } = event.data;
        
        // Count expert interactions
        expertInteractions[expertId] = (expertInteractions[expertId] || 0) + 1;
        
        // Count interaction types
        interactionTypes[interactionType] = (interactionTypes[interactionType] || 0) + 1;
      }
    });
    
    // Generate insights
    return {
      totalInteractions: debateInteractions.length,
      expertEngagement: expertInteractions,
      interactionTypes,
      topInteractionType: getTopKey(interactionTypes),
      mostEngagedExpert: getTopKey(expertInteractions),
      learningStyle: determineLearningStyle(interactionTypes),
    };
  } catch (error) {
    console.error('Failed to generate learning insights:', error);
    return null;
  }
};

/**
 * Save user preferences to local storage
 * @param {Object} preferences - User preference settings
 */
const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    );
  } catch (error) {
    console.error('Failed to save user preferences:', error);
  }
};

/**
 * Get user preferences from local storage
 * @returns {Object|null} User preferences or null if not found
 */
export const getUserPreferences = () => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return preferences ? JSON.parse(preferences) : null;
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    return null;
  }
};

/**
 * Save session data to local storage
 * @param {Object} sessionData - Current session data
 */
const saveSessionData = (sessionData) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.SESSION_DATA,
      JSON.stringify(sessionData)
    );
  } catch (error) {
    console.error('Failed to save session data:', error);
  }
};

/**
 * Get session data from local storage
 * @returns {Object|null} Session data or null if not found
 */
const getSessionData = () => {
  try {
    const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Failed to get session data:', error);
    return null;
  }
};

/**
 * Log event to interaction history
 * @param {string} type - Event type
 * @param {Object} data - Event data
 */
const logEvent = (type, data) => {
  try {
    // Get existing history
    const history = getInteractionHistory();
    
    // Add new event
    history.push({
      type,
      data,
      timestamp: Date.now(),
    });
    
    // Limit history size (keep last 1000 events)
    if (history.length > 1000) {
      history.shift();
    }
    
    // Save updated history
    localStorage.setItem(
      STORAGE_KEYS.INTERACTION_HISTORY,
      JSON.stringify(history)
    );
  } catch (error) {
    console.error('Failed to log event:', error);
  }
};

/**
 * Get interaction history from local storage
 * @returns {Array} Interaction event history
 */
const getInteractionHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.INTERACTION_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get interaction history:', error);
    return [];
  }
};

/**
 * Generate unique session ID
 * @returns {string} Session identifier
 */
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

/**
 * Get device information
 * @returns {Object} Device information
 */
const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
};

/**
 * Get key with highest value from object
 * @param {Object} obj - Object with numeric values
 * @returns {string|null} Key with highest value or null if empty
 */
const getTopKey = (obj) => {
  if (!obj || Object.keys(obj).length === 0) return null;
  
  return Object.entries(obj).reduce(
    (top, [key, value]) => (value > top.value ? { key, value } : top),
    { key: Object.keys(obj)[0], value: obj[Object.keys(obj)[0]] }
  ).key;
};

/**
 * Determine user learning style based on interaction patterns
 * @param {Object} interactionTypes - Counts of different interaction types
 * @returns {string} Learning style descriptor
 */
const determineLearningStyle = (interactionTypes) => {
  // Count different categories of interactions
  const questionCount = interactionTypes.question || 0;
  const challengeCount = interactionTypes.challenge || 0;
  const evidenceCount = interactionTypes.evidence || 0;
  
  // Determine primary learning style
  if (questionCount > challengeCount && questionCount > evidenceCount) {
    return 'Inquisitive Explorer';
  } else if (challengeCount > questionCount && challengeCount > evidenceCount) {
    return 'Critical Thinker';
  } else if (evidenceCount > questionCount && evidenceCount > challengeCount) {
    return 'Evidence-Based Analyzer';
  } else {
    return 'Balanced Learner';
  }
};

/**
 * Clear all analytics data
 * @returns {boolean} Success status
 */
export const clearAnalyticsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.INTERACTION_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
    return true;
  } catch (error) {
    console.error('Failed to clear analytics data:', error);
    return false;
  }
};

export default {
  initAnalytics,
  trackDebateStart,
  trackExpertInteraction,
  trackCitationExplored,
  trackUserPreferences,
  trackDebateCompletion,
  generateLearningInsights,
  getUserPreferences,
  clearAnalyticsData,
  saveUserPreferences
};