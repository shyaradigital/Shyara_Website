import React, { useEffect } from 'react';
import { X } from 'lucide-react';
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
      onOpenChange(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0',
        overflowY: 'auto',
        overflowX: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={handleBackdropClick}
    >
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .drive-modal-content {
            animation: slideUp 0.3s ease-out;
          }
          /* Typography scaling */
          @media (max-width: 640px) {
            .drive-modal-title {
              font-size: 1.25rem !important; /* text-xl */
            }
            .drive-modal-subtitle {
              font-size: 0.875rem !important; /* text-sm */
            }
          }
          @media (min-width: 641px) {
            .drive-modal-title {
              font-size: 1.5rem !important; /* text-2xl */
            }
            .drive-modal-subtitle {
              font-size: 0.95rem !important;
            }
          }
          @media (min-width: 768px) {
            .drive-modal-title {
              font-size: 1.875rem !important; /* text-3xl */
            }
            .drive-modal-subtitle {
              font-size: 1rem !important; /* text-base */
            }
          }
          @media (min-width: 1024px) {
            .drive-modal-title {
              font-size: 2.25rem !important; /* text-4xl */
            }
            .drive-modal-subtitle {
              font-size: 1.125rem !important; /* text-lg */
            }
          }
          @media (max-width: 768px) {
            .drive-modal-content {
              max-width: 100% !important;
              margin: 0 !important;
              min-height: 100vh !important;
              height: auto !important;
              border-radius: 0 !important;
            }
            .drive-modal-header {
              flex-direction: column !important;
              align-items: flex-start !important;
              padding: 1rem !important;
            }
            .drive-modal-header > div:first-child {
              width: 100% !important;
            }
            .drive-modal-header .stats-badge {
              width: 100% !important;
              margin-left: 0 !important;
              margin-top: 0.75rem !important;
            }
            .drive-modal-body {
              padding: 1rem !important;
            }
          }
          @media (max-width: 1024px) {
            .drive-modal-content {
              max-height: none !important;
            }
          }
        `}
      </style>

      <div
        className="drive-modal-content"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          borderRadius: '1rem',
          border: '1px solid rgba(126, 34, 206, 0.3)',
          maxWidth: '72rem',
          width: '100%',
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          minHeight: '100vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="drive-modal-header"
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(38, 38, 38, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            flexShrink: 0
          }}
        >
          <div
            className="drive-modal-header-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <div className="drive-modal-title-section" style={{ flex: 1, minWidth: '200px' }}>
              <h2
                className="drive-modal-title"
                style={{
                  color: '#c4b5fd',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.3
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  className="drive-modal-subtitle"
                  style={{
                    color: 'rgba(212, 212, 212, 0.7)',
                    fontSize: '0.875rem',
                    margin: '0.375rem 0 0 0',
                    lineHeight: 1.4
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Stats Badge */}
            {statsBadgeText && (
              <div
                className="stats-badge"
                style={{
                  background: 'rgba(15, 24, 18, 1)',
                  border: '1px solid rgba(29, 59, 38, 1)',
                  borderRadius: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  minWidth: 'auto',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: 'fit-content',
                  marginLeft: '0',
                  gap: '0.25rem'
                }}
              >
                {statsBadgeText.split(', ').map((part, index) => (
                  <p
                    key={index}
                    style={{
                      color: '#4ade80',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      lineHeight: 1.3,
                      margin: 0
                    }}
                  >
                    {part}
                  </p>
                ))}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                color: 'rgba(212, 212, 212, 0.8)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                width: '2rem',
                height: '2rem',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'rgba(212, 212, 212, 0.8)';
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          className="drive-modal-body"
          style={{
            padding: '1rem 1.5rem calc(1.5rem + env(safe-area-inset-bottom, 0px)) 1.5rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: 0
          }}
        >
          <div style={{ 
            width: '100%', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column'
          }}>
            <DriveMockup title={title} folderId={folderId} />
          </div>

          {/* Helper text */}
          <p
            style={{
              color: 'rgba(212, 212, 212, 0.5)',
              fontSize: '0.8rem',
              marginTop: '0.75rem',
              textAlign: 'center',
              lineHeight: 1.4
            }}
          >
            Scroll inside the gallery to explore all creatives
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriveMockupModal;

