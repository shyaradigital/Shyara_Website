import React, { useState, useEffect } from 'react';
import DrivePreviewModal from './DrivePreviewModal';

// Helper function to get image URL - uses thumbnailLink or fallback
const getImageUrl = (file) => {
  // Use thumbnailLink if available, otherwise use fallback
  if (file.thumbnailLink) {
    return file.thumbnailLink;
  }
  // Fallback: Google Drive thumbnail URL
  return `https://lh3.googleusercontent.com/d/${file.id}=s800`;
};

// Helper function to get full image URL for preview
const getFullImageUrl = (file) => {
  // For preview, use higher resolution
  if (file.thumbnailLink) {
    // Upgrade thumbnail resolution to 1920px
    return file.thumbnailLink.replace(/=s\d+/, '=s1920').replace(/=w\d+-h\d+/, '=w1920-h1920');
  }
  // Fallback: Google Drive thumbnail URL with higher resolution
  return `https://lh3.googleusercontent.com/d/${file.id}=s1920`;
};

// Simple thumbnail tile component with loading state - NO WebGL, NO canvas, NO lazy loading
const ThumbnailTile = ({ file, isVideo, index, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(getImageUrl(file));
  const fallbackUrl = `https://lh3.googleusercontent.com/d/${file.id}=s800`;

  const handleImageError = () => {
    if (currentSrc !== fallbackUrl) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Primary image failed, trying fallback:', file.name);
      }
      setCurrentSrc(fallbackUrl);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Both image URLs failed:', file.name, file.id);
      }
      setError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className="drive-tile"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        animation: `fadeIn 0.4s ease-out ${index * 0.03}s both`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(162, 89, 247, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(162, 89, 247, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
      }}
    >
      {/* Thumbnail Container */}
      <div
        className="thumbnail-image-container"
        style={{
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Skeleton placeholder */}
        {!loaded && !error && (
          <div
            className="w-full h-full bg-[#111]/50 animate-pulse rounded-md"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(17, 17, 17, 0.5)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
        )}

        {/* Image or Video - Simple <img> tag, NO lazy loading, NO WebGL, NO canvas */}
        {isVideo ? (
          <>
            <img
              src={currentSrc}
              alt={file.name}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                display: loaded && !error ? 'block' : 'none',
                background: 'transparent'
              }}
              onLoad={() => {
                setLoaded(true);
              }}
              onError={handleImageError}
            />
            {loaded && !error && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '50%',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  zIndex: 3,
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '12px solid #000',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    marginLeft: '4px'
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <img
            src={currentSrc}
            alt={file.name}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              display: loaded && !error ? 'block' : 'none',
              background: 'transparent'
            }}
            onLoad={() => {
              setLoaded(true);
            }}
            onError={handleImageError}
          />
        )}
      </div>
    </div>
  );
};

/**
 * DriveMockup Component
 * 
 * Renders a browser-window style frame with a custom Google Drive gallery grid.
 * 
 * @param {Object} props
 * @param {string} props.title - Title for the mockup
 * @param {string} [props.description] - Optional description
 * @param {string} props.folderId - Google Drive folder ID
 */
const DriveMockup = ({ title, description, folderId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const getApiBase = () => {
    // Prefer an explicit backend URL when the frontend is hosted separately (static/CDN)
    const envBase =
      (process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE_URL || '').trim();
    if (envBase) {
      return envBase.replace(/\/+$/, '');
    }

    // Fallbacks: same-origin for combined deployments, CRA proxy in development
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin.replace(/\/+$/, '');
    }

    return '';
  };

  // Determine API endpoint - supports same-origin and external backend hosts
  const getApiUrl = (folderId) => {
    const baseUrl = getApiBase();

    if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_BACKEND_URL) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[DriveMockup] Using current origin for API calls. ' +
          'Set REACT_APP_BACKEND_URL when hosting frontend and backend on different domains.'
        );
      }
    }

    return `${baseUrl}/api/drive-list/${folderId}`;
  };

  useEffect(() => {
    if (!folderId) {
      setError('No folder ID provided');
      setLoading(false);
      return;
    }

    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = getApiUrl(folderId);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          // Handle different error scenarios
          let errorData;
          let errorMessage = 'Failed to load files from Google Drive';
          
          // Special handling for 404 - API endpoint not found
          if (response.status === 404) {
            errorMessage = 'API endpoint not found. Please ensure the backend server is running and the API routes are configured correctly.';
            errorData = { 
              error: errorMessage,
              status: 404,
              statusText: response.statusText
            };
          } else {
            // Try to get detailed error information for other status codes
            try {
              // Check if response body is already consumed
              if (response.bodyUsed) {
                errorData = { 
                  error: `HTTP ${response.status}: ${response.statusText}`, 
                  raw: 'Response body already consumed' 
                };
              } else {
                // Try to read as JSON first
                try {
                  const clonedResponse = response.clone();
                  errorData = await clonedResponse.json();
                } catch (jsonError) {
                  // If JSON parsing fails, try text (but only if body isn't used)
                  if (!response.bodyUsed) {
                    try {
                      const textResponse = response.clone();
                      const text = await textResponse.text();
                      errorData = { 
                        error: `HTTP ${response.status}: ${response.statusText}`, 
                        raw: text || 'Empty response' 
                      };
                    } catch (textError) {
                      // If text reading also fails, create basic error
                      errorData = { 
                        error: `HTTP ${response.status}: ${response.statusText}`, 
                        raw: 'Could not read response body' 
                      };
                    }
                  } else {
                    errorData = { 
                      error: `HTTP ${response.status}: ${response.statusText}`, 
                      raw: 'Response body already consumed' 
                    };
                  }
                }
              }
            } catch (e) {
              // If all else fails, create a basic error object
              errorData = { 
                error: `HTTP ${response.status}: ${response.statusText}`, 
                raw: e.message || 'Could not read error response',
                details: 'Failed to parse error response'
              };
            }
            
            // Extract user-friendly error message from errorData
            if (errorData.details) {
              if (errorData.details.error) {
                errorMessage = errorData.details.error.message || errorMessage;
              } else if (errorData.details.raw) {
                errorMessage = `API Error: ${errorData.details.raw.substring(0, 100)}`;
              }
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.error('API Error Response:', errorData);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Validate response structure
        if (!data || !Array.isArray(data.files)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Unexpected API response format:', data);
          }
          setFiles([]);
          setError('Invalid response format from server');
          return;
        }
        
        const fetchedFiles = data.files || [];
        
        setFiles(fetchedFiles);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching Drive files:', err);
        }
        setError(err.message || 'Failed to load files from Google Drive. Please check folder permissions and API configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]);

  if (!folderId) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'rgba(212, 212, 212, 0.7)'
      }}>
        Invalid folder ID
      </div>
    );
  }

  return (
    <>
      <div
        className="drive-mockup-wrapper"
        style={{
          borderRadius: '0',
          border: 'none',
          background: 'transparent',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >

        {/* Clean Gallery Content */}
        <div
          style={{
            width: '100%',
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            background: 'transparent',
            position: 'relative',
            WebkitOverflowScrolling: 'touch',
            padding: 'clamp(1rem, 2vw, 1.5rem)'
          }}
        >
          {/* Loading State */}
          {loading && (
            <div
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: '1rem',
                background: 'transparent'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(162, 89, 247, 0.2)',
                borderTop: '3px solid #a259f7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', fontWeight: 500 }}>
                Loading gallery...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: '1rem',
                textAlign: 'center',
                background: 'transparent'
              }}
            >
              <div style={{ 
                fontSize: '2.5rem',
                filter: 'grayscale(1)',
                opacity: 0.5
              }}>⚠️</div>
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: 'rgba(255, 255, 255, 0.8)' 
              }}>
                Unable to load gallery
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: 'rgba(255, 255, 255, 0.4)',
                maxWidth: '400px',
                lineHeight: 1.5
              }}>
                {error}
              </div>
            </div>
          )}

          {/* Modern Clean Gallery Grid */}
          {!loading && !error && files.length > 0 && (
            <div
              className="drive-gallery-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 'clamp(0.75rem, 2vw, 1.25rem)',
                padding: '0',
                background: 'transparent',
                maxWidth: '100%',
                margin: '0 auto'
              }}
            >
              {files.map((file, index) => {
                const isVideo = file.mimeType && file.mimeType.startsWith('video/');
                return (
                  <ThumbnailTile
                    key={file.id}
                    file={file}
                    isVideo={isVideo}
                    index={index}
                    onClick={() => setActiveIndex(index)}
                  />
                );
              })}
            </div>
          )}

          {/* Empty State - We're Cooking */}
          {!loading && !error && files.length === 0 && (
            <div
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: '1rem',
                textAlign: 'center',
                background: 'transparent'
              }}
            >
              <div style={{ 
                fontSize: '3.5rem',
                filter: 'grayscale(0)',
                animation: 'float 3s ease-in-out infinite'
              }}>🍳</div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.02em'
              }}>
                We're Cooking
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: 'rgba(255, 255, 255, 0.5)',
                maxWidth: '300px',
                lineHeight: 1.5
              }}>
                Fresh content is on the way. Check back soon!
              </div>
            </div>
          )}
          
          <style>
            {`
              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
            `}
          </style>

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes pulse {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.5;
                }
              }
              /* Modern Responsive Grid */
              @media (max-width: 480px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 0.75rem !important;
                }
                .thumbnail-image-container {
                  height: 160px !important;
                }
              }
              
              @media (min-width: 481px) and (max-width: 768px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(3, 1fr) !important;
                  gap: 1rem !important;
                }
                .thumbnail-image-container {
                  height: 180px !important;
                }
              }
              
              @media (min-width: 769px) and (max-width: 1024px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(3, 1fr) !important;
                  gap: 1.25rem !important;
                }
                .thumbnail-image-container {
                  height: 200px !important;
                }
              }
              
              @media (min-width: 1025px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
                  gap: 1.25rem !important;
                }
                .thumbnail-image-container {
                  height: 220px !important;
                }
              }
              
              /* Modern Scrollbar */
              *::-webkit-scrollbar {
                width: 10px;
                height: 10px;
              }
              
              *::-webkit-scrollbar-track {
                background: transparent;
              }
              
              *::-webkit-scrollbar-thumb {
                background: rgba(162, 89, 247, 0.3);
                border-radius: 5px;
              }
              
              *::-webkit-scrollbar-thumb:hover {
                background: rgba(162, 89, 247, 0.5);
              }
            `}
          </style>
        </div>
      </div>

      {/* Preview Modal */}
      {activeIndex !== null && files.length > 0 && (
        <DrivePreviewModal
          files={files}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
};

export default DriveMockup;
