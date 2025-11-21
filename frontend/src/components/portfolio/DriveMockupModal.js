import React, { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import DriveMockup from './DriveMockup';

/**
 * DriveMockupModal Component
 * 
 * A modal dialog that displays a Google Drive folder in a browser mockup.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onOpenChange - Callback when open state changes
 * @param {string} props.title - Modal title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {string} [props.statsBadgeText] - Optional stats badge text (e.g., "Average 60% increase in followers")
 * @param {string} props.folderId - Google Drive folder ID
 */
const DriveMockupModal = ({
  open,
  onOpenChange,
  title,
  subtitle,
  statsBadgeText,
  folderId
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onOpenChange(false);
    }
  };

  return (
    <div
      className="drive-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0',
        overflowY: 'auto',
        overflowX: 'hidden',
        animation: 'fadeIn 0.25s ease-out',
        WebkitOverflowScrolling: 'touch'
      }}
      onClick={handleBackdropClick}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .drive-modal-content {
            animation: slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Typography scaling */
          .drive-modal-title {
            font-size: clamp(1.125rem, 3vw, 2rem);
            font-weight: 600;
            line-height: 1.2;
          }
          
          .drive-modal-subtitle {
            font-size: clamp(0.8125rem, 1.5vw, 1rem);
            line-height: 1.4;
          }
          
          /* Ensure header content is visible */
          @media (max-width: 640px) {
            .drive-modal-title {
              font-size: 1.125rem !important;
            }
            .drive-modal-subtitle {
              font-size: 0.8125rem !important;
            }
            .stats-badge {
              margin-top: 0.5rem !important;
              padding: 0.5rem 0.75rem !important;
            }
          }
          
          /* Default - Desktop */
          .drive-modal-content {
            margin-top: 1.5rem;
          }
          
          /* Mobile - Full Screen Below Navbar */
          @media (max-width: 640px) {
            .drive-modal-overlay {
              padding: 0 !important;
              align-items: flex-start !important;
            }
            
            .drive-modal-content {
              max-width: 100% !important;
              width: 100% !important;
              margin: 0 !important;
              margin-top: 75px !important;
              min-height: calc(100vh - 75px) !important;
              max-height: calc(100vh - 75px) !important;
              border-radius: 0 !important;
            }
            
            .drive-modal-header {
              padding: 0.875rem 1rem !important;
              position: sticky !important;
              top: 0 !important;
              z-index: 10 !important;
              background: rgba(15, 15, 20, 1) !important;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            .drive-modal-body {
              padding: 1rem !important;
            }
          }
          
          /* Tablet */
          @media (min-width: 641px) and (max-width: 1024px) {
            .drive-modal-overlay {
              padding: 0.5rem !important;
            }
            
            .drive-modal-content {
              border-radius: 12px !important;
              margin-top: 85px !important;
              max-height: calc(92vh - 85px) !important;
              width: 95% !important;
            }
            
            .drive-modal-header {
              padding: 1rem 1.25rem !important;
            }
          }
          
          /* Desktop */
          @media (min-width: 1025px) {
            .drive-modal-overlay {
              padding: 1.5rem !important;
            }
            
            .drive-modal-content {
              border-radius: 16px !important;
              margin-top: 0 !important;
              width: 95% !important;
            }
          }
        `}
      </style>

      <div
        className="drive-modal-content"
        style={{
          background: 'rgba(15, 15, 20, 0.98)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          maxWidth: '90rem',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header with Back Button */}
        <div
          className="drive-modal-header"
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            flexShrink: 0,
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Back Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(false);
            }}
            style={{
              background: 'rgba(162, 89, 247, 0.1)',
              border: '1px solid rgba(162, 89, 247, 0.3)',
              borderRadius: '8px',
              color: '#c4b5fd',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              width: '2.25rem',
              height: '2.25rem',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(162, 89, 247, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(162, 89, 247, 0.5)';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(162, 89, 247, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(162, 89, 247, 0.3)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Title Section */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              className="drive-modal-title"
              style={{
                color: '#f5f5f7',
                margin: '0 0 0.375rem 0'
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="drive-modal-subtitle"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: 0
                }}
              >
                {subtitle}
              </p>
            )}
            
            {/* Stats Badge - Inline below title */}
            {statsBadgeText && (
              <div
                className="stats-badge"
                style={{
                  marginTop: '0.75rem',
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '8px',
                  padding: '0.625rem 0.875rem',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                {statsBadgeText.split(', ').map((part, index) => (
                  <span
                    key={index}
                    style={{
                      color: '#4ade80',
                      fontWeight: 500,
                      fontSize: '0.8125rem',
                      lineHeight: 1.3
                    }}
                  >
                    {part}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(false);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              width: '2.25rem',
              height: '2.25rem',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body - Clean Gallery */}
        <div
          className="drive-modal-body"
          style={{
            padding: '0',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: 0,
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            width: '100%', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <DriveMockup title={title} folderId={folderId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveMockupModal;

