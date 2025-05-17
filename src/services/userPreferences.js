/**
 * userPreferences.js
 * Service for managing user preferences for the Socratic Debate Simulator
 * Handles saving, loading, and updating user preferences
 */

// Default user preferences
const DEFAULT_PREFERENCES = {
  debateFormat: 'standard', // standard, oxford, socratic
  expertCount: 3,
  technicalLevel: 'medium', // beginner, medium, expert
  focusAreas: ['ethical', 'practical'], // ethical, practical, theoretical, historical
  visualizationStyle: 'mindmap', // mindmap, network, timeline
  colorMode: 'light', // light, dark, auto
  textSize: 'medium', // small, medium, large
  animationEnabled: true,
  recentTopics: [],
  favoriteExperts: [],
  accessibilitySettings: {
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false
  },
  notifications: {
    newFeatures: true,
    expertUpdates: true,
    savedDebateReminders: false
  },
  lastSeen: null
};

// Storage key for localStorage
const STORAGE_KEY = 'socratic_debate_user_preferences';

/**
 * Get all user preferences
 * @returns {Object} User preferences object
 */
export const getUserPreferences = () => {
  try {
    const storedPrefs = localStorage.getItem(STORAGE_KEY);
    if (!storedPrefs) {
      return DEFAULT_PREFERENCES;
    }
    
    const parsedPrefs = JSON.parse(storedPrefs);
    // Merge with defaults to ensure all fields exist (handles adding new preferences in updates)
    return { ...DEFAULT_PREFERENCES, ...parsedPrefs };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Save all user preferences
 * @param {Object} preferences - Complete preferences object
 * @returns {boolean} Success status
 */
export const saveUserPreferences = (preferences) => {
  try {
    const prefsToSave = { ...preferences, lastSeen: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefsToSave));
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

/**
 * Update specific user preference(s)
 * @param {Object} preferencesToUpdate - Object containing preferences to update
 * @returns {Object} Updated preferences object
 */
export const updateUserPreferences = (preferencesToUpdate) => {
  const currentPrefs = getUserPreferences();
  const updatedPrefs = { ...currentPrefs, ...preferencesToUpdate };
  saveUserPreferences(updatedPrefs);
  return updatedPrefs;
};

/**
 * Reset user preferences to defaults
 * @returns {Object} Default preferences
 */
export const resetUserPreferences = () => {
  saveUserPreferences(DEFAULT_PREFERENCES);
  return DEFAULT_PREFERENCES;
};

/**
 * Add a topic to recent topics
 * @param {string} topic - Topic to add to recent list
 * @returns {Array} Updated recent topics array
 */
export const addRecentTopic = (topic) => {
  const currentPrefs = getUserPreferences();
  const recentTopics = [topic, ...currentPrefs.recentTopics.filter(t => t !== topic)].slice(0, 10);
  updateUserPreferences({ recentTopics });
  return recentTopics;
};

/**
 * Add or remove an expert from favorites
 * @param {string} expertId - Expert ID to toggle in favorites
 * @returns {Array} Updated favorite experts array
 */
export const toggleFavoriteExpert = (expertId) => {
  const currentPrefs = getUserPreferences();
  let favoriteExperts;
  
  if (currentPrefs.favoriteExperts.includes(expertId)) {
    favoriteExperts = currentPrefs.favoriteExperts.filter(id => id !== expertId);
  } else {
    favoriteExperts = [...currentPrefs.favoriteExperts, expertId].slice(0, 20);
  }
  
  updateUserPreferences({ favoriteExperts });
  return favoriteExperts;
};

/**
 * Update visualization preferences
 * @param {Object} visualizationPrefs - Object with visualization preferences
 * @returns {Object} Updated preferences object
 */
export const updateVisualizationPreferences = (visualizationPrefs) => {
  const currentPrefs = getUserPreferences();
  const updatedPrefs = { 
    ...currentPrefs,
    visualizationStyle: visualizationPrefs.style || currentPrefs.visualizationStyle,
    animationEnabled: 
      visualizationPrefs.animationEnabled !== undefined 
        ? visualizationPrefs.animationEnabled 
        : currentPrefs.animationEnabled
  };
  
  saveUserPreferences(updatedPrefs);
  return updatedPrefs;
};

/**
 * Update accessibility settings
 * @param {Object} accessibilitySettings - Object with accessibility settings
 * @returns {Object} Updated accessibility settings
 */
export const updateAccessibilitySettings = (accessibilitySettings) => {
  const currentPrefs = getUserPreferences();
  const updatedSettings = {
    ...currentPrefs.accessibilitySettings,
    ...accessibilitySettings
  };
  
  updateUserPreferences({ accessibilitySettings: updatedSettings });
  return updatedSettings;
};

/**
 * Check if this is the user's first visit
 * @returns {boolean} True if first visit
 */
export const isFirstVisit = () => {
  const prefs = getUserPreferences();
  return prefs.lastSeen === null;
};

/**
 * Export user preferences to a file
 * @returns {Blob} Preferences as a JSON file blob
 */
export const exportUserPreferences = () => {
  const prefs = getUserPreferences();
  const prefsJson = JSON.stringify(prefs, null, 2);
  return new Blob([prefsJson], { type: 'application/json' });
};

/**
 * Import user preferences from a JSON object
 * @param {Object} importedPrefs - Preferences object to import
 * @returns {Object} Imported and normalized preferences
 */
export const importUserPreferences = (importedPrefs) => {
  // Validate and normalize imported preferences
  const normalizedPrefs = { ...DEFAULT_PREFERENCES, ...importedPrefs };
  saveUserPreferences(normalizedPrefs);
  return normalizedPrefs;
};

export default {
  getUserPreferences,
  saveUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
  addRecentTopic,
  toggleFavoriteExpert,
  updateVisualizationPreferences,
  updateAccessibilitySettings,
  isFirstVisit,
  exportUserPreferences,
  importUserPreferences
};
