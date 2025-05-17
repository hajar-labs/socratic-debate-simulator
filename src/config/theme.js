// Configuration for theme-related settings
// This centralizes all visual design tokens from the design document

const theme = {
  colors: {
    // Primary color scheme from design document
    deepNavy: '#1A2B47',     // Primary background, conveying depth and trustworthiness
    pearlWhite: '#F1F2F6',   // Text and primary content areas
    amberAccent: '#F39C12',  // Highlighting active elements and user controls
    sageGreen: '#7CB342',    // Indicating areas of agreement or consensus
    coralRed: '#E74C3C',     // Highlighting disagreements or contradictions
    
    // Additional UI colors
    lightGray: '#E0E0E0',    // Inactive elements
    mediumGray: '#9E9E9E',   // Secondary text
    darkGray: '#424242',     // Tertiary text
    shadowColor: 'rgba(0, 0, 0, 0.12)',  // For depth and shadows
  },
  
  typography: {
    // Typography system from design document
    fontFamily: {
      heading: '"Playfair Display", serif',  // Adding intellectual authority
      body: '"Inter", sans-serif',           // Ensuring excellent readability
      mono: '"Roboto Mono", monospace',      // Providing clear structure for argument labels
      citation: '"Source Sans Pro", sans-serif', // Maintaining readability at smaller sizes
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
  },
  
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
    full: '9999px',  // Circular elements
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease-in-out',
    expertTransition: '0.4s ease-in-out', // From design spec
  },
  
  // Visual language elements from design
  visualElements: {
    circleMotifs: {
      small: '1rem',
      medium: '2rem',
      large: '4rem',
    },
    connectionLineWidth: {
      thin: '1px',
      medium: '2px',
      thick: '3px',
    },
  },
  
  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    above: 10,
    modal: 20,
    toast: 30,
    tooltip: 40,
  },
};

export default theme;