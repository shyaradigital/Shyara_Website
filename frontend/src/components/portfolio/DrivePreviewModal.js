import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * DrivePreviewModal Component
 * 
 * Fullscreen image/video viewer with zoom, navigation, and keyboard controls.
 * Styled to match Google Drive's preview experience.
 * 
 * @param {Object} props
 * @param {Array} props.files - Array of file objects
 * @param {number} props.index - Current file index
 * @param {Function} props.onClose - Callback to close the modal
 */
const DrivePreviewModal = ({ files, index, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const historyAddedRef = useRef(false);
  const isClosingRef = useRef(false);

  const currentFile = files[currentIndex];
  const isVideo = currentFile?.mimeType?.startsWith('video/');

  // Handle browser back button/swipe back
  useEffect(() => {
    const handlePopState = (e) => {
      // Close preview modal when user swipes back - go back to gallery modal
      if (historyAddedRef.current && !isClosingRef.current) {
        historyAddedRef.current = false;
        isClosingRef.current = false;
        // Call onClose to return to gallery modal
        // The browser has already navigated back in history (removed preview state)
        // We're now at the gallery modal state, so just close the preview
        // The gallery modal should remain open
        onClose();
      }
      isClosingRef.current = false;
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // Push history state when modal opens
  useEffect(() => {
    if (files && files.length > 0 && index !== null && !historyAddedRef.current) {
      window.history.pushState({ preview: true }, '');
      historyAddedRef.current = true;
    }
  }, [files, index]);

  // Lock body scroll when modal opens
  useEffect(() => {
    if (!files || files.length === 0) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [files]);

  // Helper function to get full image URL for preview
  const getFullImageUrl = (file) => {
    if (!file) return '';
    // Use thumbnailLink if available, upgrade to higher resolution
    if (file.thumbnailLink) {
      // Upgrade thumbnail resolution to 1920px for preview
      return file.thumbnailLink.replace(/=s\d+/, '=s1920').replace(/=w\d+-h\d+/, '=w1920-h1920');
    }
    // Fallback: Google Drive thumbnail URL with higher resolution
    return `https://lh3.googleusercontent.com/d/${file.id}=s1920`;
  };

  const [currentSrc, setCurrentSrc] = useState(currentFile ? getFullImageUrl(currentFile) : '');

  // Reset zoom and position when file changes
  useEffect(() => {
    setCurrentIndex(index);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
    // Update image source when file changes
    if (files[index]) {
      setCurrentSrc(getFullImageUrl(files[index]));
    }
  }, [index, files]);

  // Define navigation functions BEFORE useEffect
  const handleNext = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop to start
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(files.length - 1); // Loop to end
    }
  };

  const handleImageError = () => {
    const file = files[currentIndex];
    if (!file) return;
    const fallback = `https://lh3.googleusercontent.com/d/${file.id}=s1920`;
    if (currentSrc !== fallback) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Primary image failed, trying fallback:', file.name);
      }
      setCurrentSrc(fallback);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Both image URLs failed:', file.name, file.id);
      }
      setImageLoaded(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse drag for panning when zoomed
  const handleMouseDown = (e) => {
    if (zoom > 1 && !isVideo) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    if (zoom > 1) return; // Don't swipe when zoomed
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e) => {
    if (zoom > 1 || !touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    // Horizontal swipe (more significant than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setTouchStart(null);
  };

  // Double click to zoom
  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      handleResetZoom();
    }
  };


  if (!currentFile) return null;

  return (
    <div
      className="preview-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 20000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.25s ease-out',
        cursor: zoom > 1 && !isVideo ? (isDragging ? 'grabbing' : 'grab') : 'default',
        padding: '0',
        paddingTop: '85px',
        paddingBottom: 'clamp(1rem, 2vw, 2rem)',
        paddingLeft: 'clamp(1rem, 2vw, 2rem)',
        paddingRight: 'clamp(1rem, 2vw, 2rem)',
        overflow: 'hidden'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            // Only close if clicking the backdrop itself, not the image or controls
            if (e.target === e.currentTarget) {
              e.preventDefault();
              e.stopPropagation();
              // Close preview modal and return to gallery modal
              // Just call onClose directly - this will close the preview and show the gallery
              // Don't manipulate history here to avoid triggering popstate handlers
              if (historyAddedRef.current) {
                historyAddedRef.current = false;
              }
              onClose();
            }
          }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          /* Modern Responsive Lightbox */
          @media (max-width: 640px) {
            .preview-modal-overlay {
              padding: 0 !important;
              padding-top: 75px !important;
            }
            
            .preview-media-container {
              max-width: 100% !important;
              max-height: 60vh !important;
            }
            
            .preview-image {
              max-width: 100% !important;
              max-height: 60vh !important;
            }
            
            .preview-close-button {
              width: 2.5rem !important;
              height: 2.5rem !important;
              top: calc(75px + 0.75rem) !important;
              right: 0.75rem !important;
            }
            
            .preview-file-counter {
              top: calc(75px + 0.75rem) !important;
              font-size: 0.75rem !important;
              padding: 0.375rem 0.75rem !important;
            }
            
            .preview-zoom-controls {
              bottom: calc(1rem + env(safe-area-inset-bottom, 0px)) !important;
              padding: 0.5rem !important;
              gap: 0.375rem !important;
            }
            
            .preview-zoom-controls button {
              width: 2rem !important;
              height: 2rem !important;
            }
          }
          
          @media (min-width: 641px) and (max-width: 1024px) {
            .preview-modal-overlay {
              padding-top: 85px !important;
            }
            
            .preview-media-container {
              max-width: 85vw !important;
              max-height: 70vh !important;
            }
            
            .preview-image {
              max-width: 85vw !important;
              max-height: 70vh !important;
            }
            
            .preview-close-button {
              width: 2.5rem !important;
              height: 2.5rem !important;
              top: calc(85px + 1rem) !important;
              right: 1rem !important;
            }
            
            .preview-file-counter {
              top: calc(85px + 1rem) !important;
            }
          }
          
          @media (min-width: 1025px) {
            .preview-media-container {
              max-width: 90vw !important;
              max-height: 80vh !important;
            }
            
            .preview-image {
              max-width: 90vw !important;
              max-height: 80vh !important;
            }
          }
        `}
      </style>

      {/* Prominent Close Button - Always Visible */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Close preview modal and return to gallery modal
          // Just call onClose directly - this will close the preview and show the gallery
          // Don't manipulate history here to avoid triggering popstate handlers
          if (historyAddedRef.current) {
            historyAddedRef.current = false;
          }
          onClose();
        }}
        className="preview-close-button"
        style={{
          position: 'fixed',
          top: 'calc(85px + clamp(0.5rem, 2vw, 1rem))',
          right: 'clamp(1rem, 2vw, 1.5rem)',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px',
          width: '2.75rem',
          height: '2.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 20001,
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 1)';
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(239, 68, 68, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.3)';
        }}
        aria-label="Close"
      >
        <X size={22} />
      </button>
      

      {/* Navigation removed for cleaner experience - swipe or keyboard only */}

      {/* Modern Zoom Controls */}
      <div
        className="preview-zoom-controls"
        style={{
          position: 'fixed',
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '0.625rem',
          borderRadius: '10px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 50,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleZoomOut();
          }}
          disabled={zoom <= 1}
          style={{
            background: zoom <= 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '6px',
            width: '2.25rem',
            height: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: zoom <= 1 ? 'rgba(255,255,255,0.3)' : '#fff',
            cursor: zoom <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: zoom <= 1 ? 0.5 : 1
          }}
          aria-label="Zoom out"
        >
          <ZoomOut size={18} />
        </button>

        <div
          style={{
            padding: '0 0.875rem',
            height: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.8125rem',
            fontWeight: 600,
            minWidth: '4rem'
          }}
        >
          {Math.round(zoom * 100)}%
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleZoomIn();
          }}
          disabled={zoom >= 3}
          style={{
            background: zoom >= 3 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '6px',
            width: '2.25rem',
            height: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: zoom >= 3 ? 'rgba(255,255,255,0.3)' : '#fff',
            cursor: zoom >= 3 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: zoom >= 3 ? 0.5 : 1
          }}
          aria-label="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* File Counter - Top Center, Below Navbar */}
      {files.length > 1 && (
        <div
          className="preview-file-counter"
          style={{
            position: 'fixed',
            top: 'calc(85px + clamp(0.5rem, 2vw, 1rem))',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.5rem 0.875rem',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.8125rem',
            fontWeight: 600,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 20001,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)'
          }}
        >
          {currentIndex + 1} / {files.length}
        </div>
      )}

      {/* Media Container - Centered */}
      <div
        className="preview-media-container"
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: zoom > 1 && !isVideo ? (isDragging ? 'grabbing' : 'grab') : 'default',
          position: 'relative',
          overflow: 'visible'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(162, 89, 247, 0.2)',
                borderTop: '3px solid #a259f7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
        )}

        {/* Immersive Image Display */}
        {isVideo ? (
          <img
            src={currentSrc}
            alt={currentFile.name}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="preview-image"
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '100%',
              maxHeight: '80vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              display: imageLoaded ? 'block' : 'none',
              background: 'transparent',
              userSelect: 'none',
              pointerEvents: 'none',
              borderRadius: '6px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)'
            }}
            draggable={false}
            onLoad={() => {
              setImageLoaded(true);
            }}
            onError={handleImageError}
          />
        ) : (
          <img
            src={currentSrc}
            alt={currentFile.name}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="preview-image"
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '100%',
              maxHeight: '80vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              display: imageLoaded ? 'block' : 'none',
              background: 'transparent',
              userSelect: 'none',
              pointerEvents: 'none',
              borderRadius: '6px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)'
            }}
            draggable={false}
            onLoad={() => {
              setImageLoaded(true);
            }}
            onError={handleImageError}
          />
        )}
      </div>
    </div>
  );
};

export default DrivePreviewModal;

