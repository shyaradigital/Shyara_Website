import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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

  const currentFile = files[currentIndex];
  const isVideo = currentFile?.mimeType?.startsWith('video/');

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

  const handleImageError = () => {
    const file = files[currentIndex];
    if (!file) return;
    const fallback = `https://lh3.googleusercontent.com/d/${file.id}=s1920`;
    if (currentSrc !== fallback) {
      console.warn('Primary image failed, trying fallback:', file.name);
      setCurrentSrc(fallback);
    } else {
      console.error('Both image URLs failed:', file.name, file.id);
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
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 20000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
        cursor: zoom > 1 && !isVideo ? (isDragging ? 'grabbing' : 'grab') : 'default',
        padding: '1rem',
        paddingTop: '4rem',
        paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        // Close on backdrop click (not on image)
        if (e.target === e.currentTarget) {
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
          /* Responsive preview modal */
          @media (max-width: 640px) {
            .preview-modal-overlay {
              padding-top: 3rem !important;
              padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px)) !important;
            }
            .preview-media-container {
              max-width: 100% !important;
              max-height: 85vh !important;
              padding-bottom: 2rem !important;
            }
            .preview-image {
              max-width: 100% !important;
              max-height: 80vh !important;
            }
            .preview-nav-button {
              width: 2rem !important;
              height: 2rem !important;
            }
            .preview-nav-button svg {
              width: 16px !important;
              height: 16px !important;
            }
            .preview-close-button {
              width: 2rem !important;
              height: 2rem !important;
              top: 0.75rem !important;
              right: 0.75rem !important;
            }
            .preview-close-button svg {
              width: 16px !important;
              height: 16px !important;
            }
            .preview-file-name {
              bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px)) !important;
              font-size: 0.75rem !important;
              padding: 0.5rem 1rem !important;
            }
            .preview-zoom-controls {
              bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px)) !important;
              padding: 0.5rem !important;
            }
          }
          @media (min-width: 641px) and (max-width: 1024px) {
            .preview-modal-overlay {
              padding-top: 3.5rem !important;
            }
            .preview-media-container {
              max-width: 100% !important;
              max-height: 85vh !important;
            }
            .preview-image {
              max-width: 100% !important;
              max-height: 80vh !important;
            }
          }
          @media (min-width: 1025px) {
            .preview-modal-overlay {
              padding-top: 4rem !important;
            }
            .preview-media-container {
              max-width: 100% !important;
              max-height: 85vh !important;
            }
            .preview-image {
              max-width: 100% !important;
              max-height: 80vh !important;
            }
          }
        `}
      </style>

      {/* Close button */}
      <button
        onClick={onClose}
        className="preview-close-button"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'all 0.2s',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Navigation arrows - Inside modal, vertically centered */}
      {files.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="preview-nav-button preview-nav-prev"
            style={{
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              zIndex: 50,
              transition: 'all 0.2s',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(162, 89, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="preview-nav-button preview-nav-next"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              zIndex: 50,
              transition: 'all 0.2s',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(162, 89, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Zoom controls - Bottom with safe area */}
      <div
        className="preview-zoom-controls"
        style={{
          position: 'fixed',
          bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 50,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          style={{
            background: zoom <= 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.25rem',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: zoom <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          aria-label="Zoom out"
        >
          <ZoomOut size={20} />
        </button>

        <button
          onClick={handleResetZoom}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.25rem',
            padding: '0 1rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          style={{
            background: zoom >= 3 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.25rem',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: zoom >= 3 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          aria-label="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
      </div>

      {/* File counter - Top */}
      {files.length > 1 && (
        <div
          className="preview-file-counter"
          style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '0.5rem 1rem',
            borderRadius: '0.75rem',
            color: '#fff',
            fontSize: '0.875rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 50,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          {currentIndex + 1} / {files.length}
        </div>
      )}

      {/* File name - Above zoom controls */}
      <div
        className="preview-file-name"
        style={{
          position: 'fixed',
          bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.75rem',
          color: '#fff',
          fontSize: '0.875rem',
          maxWidth: '90%',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 50,
          wordBreak: 'break-word',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        {currentFile.name}
      </div>

      {/* Media container */}
      <div
        className="preview-media-container"
        style={{
          maxWidth: '100%',
          maxHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'slideIn 0.3s ease-out',
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          cursor: zoom > 1 && !isVideo ? (isDragging ? 'grabbing' : 'grab') : 'default',
          position: 'relative',
          background: 'transparent',
          borderRadius: '0.75rem',
          padding: '0',
          paddingBottom: '2rem',
          border: 'none',
          overflow: 'visible'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {/* Skeleton placeholder */}
        {!imageLoaded && (
          <div
            className="w-full h-full bg-[#111]/50 animate-pulse rounded-xl"
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              bottom: '1.5rem',
              background: 'rgba(17, 17, 17, 0.5)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              borderRadius: '0.75rem'
            }}
          />
        )}

        {/* Image or Video - Simple <img> tag, NO lazy loading, NO WebGL, NO canvas */}
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
              transition: 'opacity 0.3s ease-in-out',
              display: imageLoaded ? 'block' : 'none',
              background: 'transparent',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
            draggable={false}
            onLoad={() => {
              setImageLoaded(true);
              console.log('✅ Video thumbnail loaded in preview:', currentFile.name);
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
              transition: 'opacity 0.3s ease-in-out',
              display: imageLoaded ? 'block' : 'none',
              background: 'transparent',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
            draggable={false}
            onLoad={() => {
              setImageLoaded(true);
              console.log('✅ Full image loaded in preview:', currentFile.name);
            }}
            onError={handleImageError}
          />
        )}
      </div>
    </div>
  );
};

export default DrivePreviewModal;

