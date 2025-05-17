import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import theme from '../../config/theme';
import Button from './Button';

/**
 * Modal component for displaying expanded evidence or expert information
 * Follows design system for consistent look and feel
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOutsideClick = true,
  footer = null,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, closeOnOutsideClick]);

  // Handle animation when opening/closing
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render anything if modal is not open and not animating
  if (!isOpen && !isAnimating) return null;

  // Determine modal size
  const sizeStyles = {
    small: {
      width: '400px',
      maxWidth: '90%',
    },
    medium: {
      width: '600px',
      maxWidth: '90%',
    },
    large: {
      width: '800px',
      maxWidth: '90%',
    },
    fullscreen: {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      margin: 0,
      borderRadius: 0,
    },
  };

  const selectedSize = sizeStyles[size] || sizeStyles.medium;

  // Overlay styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.modal,
    opacity: isOpen ? 1 : 0,
    transition: `opacity ${theme.transitions.default}`,
    padding: theme.spacing.md,
  };

  // Modal styles
  const modalStyle = {
    background: theme.colors.pearlWhite,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: size === 'fullscreen' ? '100%' : '90vh',
    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
    transition: `transform ${theme.transitions.default}, opacity ${theme.transitions.default}`,
    opacity: isOpen ? 1 : 0,
    overflow: 'hidden',
    ...selectedSize,
  };

  // Header styles
  const headerStyle = {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.colors.lightGray}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  // Title styles
  const titleStyle = {
    margin: 0,
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.deepNavy,
  };

  // Content styles
  const contentStyle = {
    padding: theme.spacing.lg,
    overflowY: 'auto',
    flexGrow: 1,
  };

  // Footer styles
  const footerStyle = {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderTop: `1px solid ${theme.colors.lightGray}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
  };

  // Handle animation end
  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  // Close button icon (X)
  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 4L4 12M4 4L12 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div 
      style={overlayStyle} 
      onTransitionEnd={handleAnimationEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div style={modalStyle} ref={modalRef}>
        <div style={headerStyle}>
          <h2 style={titleStyle} id="modal-title">{title}</h2>
          {showCloseButton && (
            <Button 
              variant="ghost" 
              size="small" 
              onClick={onClose} 
              icon={<CloseIcon />}
              aria-label="Close modal"
            />
          )}
        </div>
        
        <div style={contentStyle}>
          {children}
        </div>
        
        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullscreen']),
  showCloseButton: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  footer: PropTypes.node,
};

export default Modal;