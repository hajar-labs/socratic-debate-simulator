import React from 'react';
import PropTypes from 'prop-types';
import theme from '../../config/theme';

/**
 * Reusable Button component that follows the design system
 * Supports different variants and sizes based on the design doc
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  isActive = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  // Define style variations based on variant
  const variantStyles = {
    primary: {
      backgroundColor: isActive ? theme.colors.amberAccent : theme.colors.deepNavy,
      color: theme.colors.pearlWhite,
      hoverBg: theme.colors.amberAccent,
      activeBg: theme.colors.amberAccent,
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.deepNavy,
      hoverBg: 'rgba(26, 43, 71, 0.1)',
      activeBg: 'rgba(26, 43, 71, 0.2)',
      border: `1px solid ${theme.colors.deepNavy}`,
    },
    accent: {
      backgroundColor: theme.colors.amberAccent,
      color: theme.colors.deepNavy,
      hoverBg: '#E08C0B', // Darker amber
      activeBg: '#D07A0A', // Even darker amber for active state
      border: 'none',
    },
    intervention: {
      backgroundColor: theme.colors.sageGreen,
      color: 'white',
      hoverBg: '#6BA238', // Darker sage
      activeBg: '#5A9230', // Even darker sage for active state
      border: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.deepNavy,
      hoverBg: 'rgba(26, 43, 71, 0.05)',
      activeBg: 'rgba(26, 43, 71, 0.1)',
      border: 'none',
    },
  };

  // Define size variations
  const sizeStyles = {
    small: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: theme.typography.fontSize.sm,
      borderRadius: theme.borderRadius.sm,
    },
    medium: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: theme.typography.fontSize.base,
      borderRadius: theme.borderRadius.md,
    },
    large: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      fontSize: theme.typography.fontSize.lg,
      borderRadius: theme.borderRadius.md,
    },
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  const selectedSize = sizeStyles[size] || sizeStyles.medium;

  // Build the button style
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.body,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${theme.transitions.fast}`,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...selectedVariant,
    ...selectedSize,
  };

  // Handle hover state with React (in a real component, you'd use CSS)
  const handleMouseOver = (e) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = selectedVariant.hoverBg;
    }
  };

  const handleMouseOut = (e) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = selectedVariant.backgroundColor;
    }
  };

  const handleMouseDown = (e) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = selectedVariant.activeBg;
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = selectedVariant.hoverBg;
    }
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      className={className}
      disabled={disabled}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'intervention', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  isActive: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;