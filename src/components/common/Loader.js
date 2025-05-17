import React from 'react';
import PropTypes from 'prop-types';
import theme from '../../config/theme';

/**
 * Loader component for showing loading states
 * Different types of loaders for different scenarios
 */
const Loader = ({ type = 'spinner', size = 'medium', color = 'deepNavy', label = 'Loading...' }) => {
  // Map the size prop to actual pixel values
  const sizeMap = {
    small: '20px',
    medium: '36px',
    large: '48px',
  };
  
  const actualSize = sizeMap[size] || sizeMap.medium;
  const actualColor = theme.colors[color] || theme.colors.deepNavy;
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  };
  
  const labelStyle = {
    color: actualColor,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing.sm,
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <svg 
            width={actualSize} 
            height={actualSize} 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'spin 1s linear infinite',
            }}
          >
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke={actualColor} 
              strokeWidth="2" 
              fill="none" 
              strokeOpacity="0.3" 
            />
            <path 
              d="M12 2C6.477 2 2 6.477 2 12" 
              stroke={actualColor} 
              strokeWidth="2" 
              strokeLinecap="round" 
              fill="none" 
            />
          </svg>
        );
        
      case 'dots':
        return (
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.xs,
            }}
          >
            <style>
              {`
                @keyframes bounce {
                  0%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-6px); }
                }
              `}
            </style>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: size === 'small' ? '6px' : size === 'large' ? '10px' : '8px',
                  height: size === 'small' ? '6px' : size === 'large' ? '10px' : '8px',
                  backgroundColor: actualColor,
                  borderRadius: '50%',
                  animation: `bounce 1.4s infinite ease-in-out both`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>
        );
        
      case 'pulse':
        return (
          <div
            style={{
              width: actualSize,
              height: actualSize,
              borderRadius: '50%',
              backgroundColor: actualColor,
              opacity: 0.6,
            }}
          >
            <style>
              {`
                @keyframes pulse {
                  0% { transform: scale(0.8); opacity: 0.6; }
                  50% { transform: scale(1); opacity: 0.8; }
                  100% { transform: scale(0.8); opacity: 0.6; }
                }
              `}
            </style>
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
          </div>
        );
        
      case 'debate':
        // Special loader for debate generation - showing 3 dots representing experts
        return (
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.md,
            }}
          >
            <style>
              {`
                @keyframes debateBounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
              `}
            </style>
            {[
              theme.colors.amberAccent, 
              theme.colors.sageGreen, 
              theme.colors.coralRed
            ].map((color, i) => (
              <div
                key={i}
                style={{
                  width: size === 'small' ? '10px' : size === 'large' ? '16px' : '14px',
                  height: size === 'small' ? '10px' : size === 'large' ? '16px' : '14px',
                  backgroundColor: color,
                  borderRadius: '50%',
                  animation: `debateBounce 1.2s infinite ease-in-out`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        );
        
      default:
        return (
          <div
            style={{
              width: actualSize,
              height: actualSize,
              borderRadius: '50%',
              border: `2px solid ${actualColor}`,
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        );
    }
  };

  return (
    <div style={containerStyle} role="status" aria-label={label}>
      {renderLoader()}
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};

Loader.propTypes = {
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'debate']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  label: PropTypes.string,
};

export default Loader;