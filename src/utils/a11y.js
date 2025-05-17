/**
 * a11y.js
 * Accessibility helper functions for the Socratic Debate Simulator
 * Provides utilities for ensuring the application is accessible to all users
 */

/**
 * Announce a message to screen readers using ARIA live regions
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  // Get or create the announcement container
  let container = document.getElementById('a11y-announcer');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'a11y-announcer';
    container.className = 'sr-only';
    container.setAttribute('aria-live', priority);
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  } else {
    // Update the priority if needed
    container.setAttribute('aria-live', priority);
  }
  
  // Clear the container first (improves reliability in some screen readers)
  container.textContent = '';
  
  // Set the message after a short delay to ensure it's announced
  setTimeout(() => {
    container.textContent = message;
  }, 50);
};

/**
 * Create a unique ID for ARIA labeling
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const createAriaId = (prefix = 'aria') => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Focus trap for modal dialogs
 * @param {HTMLElement} container - Container element for the focus trap
 * @returns {Object} Controls for the focus trap
 */
export const createFocusTrap = (container) => {
  let active = false;
  let previousActiveElement = null;
  
  // Find all focusable elements
  const getFocusableElements = () => {
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  };
  
  // Handle tab key to trap focus
  const handleKeyDown = (e) => {
    if (!active || e.key !== 'Tab') return;
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Shift + Tab
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } 
    // Tab
    else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  // Activate the focus trap
  const activate = () => {
    if (active) return;
    
    previousActiveElement = document.activeElement;
    
    document.addEventListener('keydown', handleKeyDown);
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Wait a bit for the DOM to settle before focusing
      setTimeout(() => {
        focusableElements[0].focus();
      }, 50);
    }
    
    active = true;
  };
  
  // Deactivate the focus trap
  const deactivate = () => {
    if (!active) return;
    
    document.removeEventListener('keydown', handleKeyDown);
    
    if (previousActiveElement) {
      // Wait a bit for the DOM to settle before focusing
      setTimeout(() => {
        previousActiveElement.focus();
      }, 50);
    }
    
    active = false;
  };
  
  return {
    activate,
    deactivate,
    isActive: () => active
  };
};

/**
 * Check if reduced motion preference is enabled
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Generate appropriate motion styles based on user preferences
 * @param {Object} defaultStyles - Default animation styles
 * @param {Object} reducedStyles - Reduced motion alternative styles
 * @returns {Object} Appropriate styles object
 */
export const getMotionSafeStyles = (defaultStyles, reducedStyles) => {
  return prefersReducedMotion() ? reducedStyles : defaultStyles;
};

/**
 * Set appropriate animation duration based on user preferences
 * @param {number} defaultDuration - Default duration in ms
 * @returns {number} Appropriate duration in ms
 */
export const getMotionSafeDuration = (defaultDuration) => {
  return prefersReducedMotion() ? 0 : defaultDuration;
};

/**
 * Helper to create accessible descriptions for visualizations
 * @param {Object} visualizationData - Data used for the visualization
 * @param {string} visualizationType - Type of visualization
 * @returns {string} Accessible description
 */
export const createVisualizationDescription = (visualizationData, visualizationType) => {
  const descriptionFunctions = {
    'argumentMap': describeArgumentMap,
    'expertPositioning': describeExpertPositioning,
    'consensusMap': describeConsensusMap,
    'timeline': describeTimeline
  };
  
  const descriptionFunction = descriptionFunctions[visualizationType] || 
    (() => 'Visualization of debate content');
  
  return descriptionFunction(visualizationData);
};

/**
 * Create accessible description for argument map visualization
 * @param {Object} data - Argument map data
 * @returns {string} Accessible description
 */
const describeArgumentMap = (data) => {
  if (!data || !data.arguments) {
    return 'Empty argument map visualization';
  }
  
  const argumentCount = data.arguments.length;
  const supportCount = data.arguments.filter(arg => arg.type === 'support').length;
  const counterCount = data.arguments.filter(arg => arg.type === 'counter').length;
  
  return `Argument map with ${argumentCount} points, including ${supportCount} supporting arguments and ${counterCount} counter arguments.`;
};

/**
 * Create accessible description for expert positioning visualization
 * @param {Object} data - Expert positioning data
 * @returns {string} Accessible description
 */
const describeExpertPositioning = (data) => {
  if (!data || !data.experts) {
    return 'Empty expert positioning visualization';
  }
  
  const expertCount = data.experts.length;
  
  let description = `Visualization showing the relative positions of ${expertCount} experts based on their viewpoints.`;
  
  // Add information about agreement clusters if available
  if (data.clusters) {
    description += ` Experts are grouped into ${data.clusters.length} clusters of similar perspectives.`;
  }
  
  return description;
};

/**
 * Create accessible description for consensus map visualization
 * @param {Object} data - Consensus map data
 * @returns {string} Accessible description
 */
const describeConsensusMap = (data) => {
  if (!data || !data.agreements) {
    return 'Empty consensus map visualization';
  }
  
  const agreementCount = data.agreements.length;
  const disagreementCount = data.disagreements ? data.disagreements.length : 0;
  
  return `Consensus map showing ${agreementCount} points of agreement and ${disagreementCount} points of disagreement between experts.`;
};

/**
 * Create accessible description for timeline visualization
 * @param {Object} data - Timeline data
 * @returns {string} Accessible description
 */
const describeTimeline = (data) => {
  if (!data || !data.events) {
    return 'Empty debate timeline visualization';
  }
  
  const eventCount = data.events.length;
  
  return `Timeline showing ${eventCount} key points in the debate progression.`;
};

/**
 * Check if an element is visible in the viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset from viewport edges
 * @returns {boolean} True if element is visible
 */
export const isElementInViewport = (element, offset = 0) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 - offset &&
    rect.left >= 0 - offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
};

/**
 * Scroll an element into view with accessibility considerations
 * @param {HTMLElement} element - Element to scroll into view
 * @param {Object} options - Scroll options
 */
export const scrollIntoViewAccessible = (element, options = {}) => {
  if (!element) return;
  
  // Default options
  const defaultOptions = {
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'nearest',
    announceToScreenReader: false,
    announcement: ''
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  element.scrollIntoView({
    behavior: mergedOptions.behavior,
    block: mergedOptions.block,
    inline: mergedOptions.inline
  });
  
  if (mergedOptions.announceToScreenReader && mergedOptions.announcement) {
    announceToScreenReader(mergedOptions.announcement);
  }
};

export default {
  announceToScreenReader,
  createAriaId,
  createFocusTrap,
  prefersReducedMotion,
  getMotionSafeStyles,
  getMotionSafeDuration,
  createVisualizationDescription,
  isElementInViewport,
  scrollIntoViewAccessible
};