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
      console.warn('Primary image failed, trying fallback:', file.name);
      setCurrentSrc(fallbackUrl);
    } else {
      console.error('Both image URLs failed:', file.name, file.id);
      setError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className="drive-tile"
      style={{
        background: '#171717',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        animation: `fadeIn 0.4s ease-out ${index * 0.03}s both`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(122, 66, 240, 0.4), 0 0 15px rgba(122, 66, 240, 0.2), 0 0 30px rgba(122, 66, 240, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(122, 66, 240, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      {/* Thumbnail Container */}
      <div
        className="thumbnail-image-container"
        style={{
          width: '100%',
          height: '180px',
          overflow: 'hidden',
          background: '#1a1a1a',
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
                console.log('✅ Video thumbnail loaded:', file.name);
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
                  background: 'rgba(122, 66, 240, 0.9)',
                  borderRadius: '50%',
                  width: '3.5rem',
                  height: '3.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  boxShadow: '0 0 20px rgba(122, 66, 240, 0.6)',
                  zIndex: 3
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '14px solid white',
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    marginLeft: '5px'
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
              console.log('✅ Image loaded:', file.name);
            }}
            onError={handleImageError}
          />
        )}
      </div>
      
      {/* Filename */}
      <div
        className="thumbnail-filename"
        style={{
          padding: '0.5rem',
          color: '#d4d4d4',
          fontSize: '0.625rem',
          fontWeight: 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          background: '#171717',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          textAlign: 'left'
        }}
      >
        {file.name}
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
      console.warn(
        '[DriveMockup] Using current origin for API calls. ' +
        'Set REACT_APP_BACKEND_URL when hosting frontend and backend on different domains.'
      );
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
        console.log('Fetching from:', apiUrl);
        
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
          
          console.error('API Error Response:', errorData);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Validate response structure
        if (!data || !Array.isArray(data.files)) {
          console.warn('Unexpected API response format:', data);
          setFiles([]);
          setError('Invalid response format from server');
          return;
        }
        
        const fetchedFiles = data.files || [];
        
        // Debug: Log first file to verify URLs
        if (fetchedFiles.length > 0) {
          console.log('✅ Drive files fetched:', fetchedFiles.length);
          const firstFile = fetchedFiles[0];
          console.log('📁 First file structure:', {
            id: firstFile.id,
            name: firstFile.name,
            mimeType: firstFile.mimeType,
            thumbnailLink: firstFile.thumbnailLink || 'null',
            imageUrl: firstFile.thumbnailLink || `https://lh3.googleusercontent.com/d/${firstFile.id}=s800`
          });
        }
        
        setFiles(fetchedFiles);
        
        if (fetchedFiles.length === 0) {
          console.log('⚠️ No files found in folder');
        }
      } catch (err) {
        console.error('Error fetching Drive files:', err);
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
          borderRadius: '1rem', // rounded-2xl
          border: '1px solid rgba(126, 34, 206, 0.4)', // border-purple-700/40
          background: 'linear-gradient(to bottom, #0a0a0a, #171717)', // from-neutral-950 to-neutral-900
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(126, 34, 206, 0.4), 0 0 20px rgba(122, 66, 240, 0.3)', // shadow-xl shadow-purple-900/40 with purple glow
          overflow: 'hidden', // Keep hidden for rounded corners
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: 'translateY(0)',
          cursor: 'default',
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'; // hover:-translate-y-1
          e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(126, 34, 206, 0.5), 0 0 30px rgba(122, 66, 240, 0.4)'; // hover:shadow-2xl hover:shadow-purple-700/50
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(126, 34, 206, 0.4), 0 0 20px rgba(122, 66, 240, 0.3)';
        }}
      >
        {/* Browser Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            background: 'rgba(23, 23, 23, 0.95)',
            borderBottom: '1px solid rgba(38, 38, 38, 0.8)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Mac-style dots */}
          <div className="browser-dots" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ef4444' // bg-red-500
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#facc15' // bg-yellow-400
              }}
            />
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#22c55e' // bg-green-500
              }}
            />
          </div>

          {/* Label */}
          <div
            className="browser-label"
            style={{
              color: 'rgba(212, 212, 212, 0.7)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}
          >
            Portfolio – Google Drive
          </div>

          {/* Spacer for centering */}
          <div style={{ width: '60px' }} />
        </div>

        {/* Content Area - Scrollable Gallery */}
        <div
          style={{
            width: '100%',
            minHeight: '70vh',
            maxHeight: '70vh',
            overflow: 'auto',
            background: '#1a1a1a', // Dark gray background (not pure black)
            position: 'relative'
          }}
        >
          {/* Loading skeleton */}
          {loading && (
            <div
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                gap: '1rem',
                background: '#1a1a1a'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(196, 181, 253, 0.3)',
                borderTop: '3px solid rgba(196, 181, 253, 0.8)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ color: '#d4d4d4', fontSize: '0.9rem' }}>Loading gallery...</span>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                gap: '1rem',
                textAlign: 'center',
                color: '#d4d4d4',
                background: '#1a1a1a'
              }}
            >
              <div style={{ fontSize: '2rem' }}>⚠️</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444' }}>Unable to load gallery</div>
              <div style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>{error}</div>
              <div style={{ fontSize: '0.75rem', color: '#737373', marginTop: '0.5rem' }}>
                Please ensure the folder is publicly shared and the API key is configured.
              </div>
            </div>
          )}

          {/* Google Drive-style Gallery Grid */}
          {!loading && !error && files.length > 0 && (
            <div
              className="drive-gallery-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem',
                padding: '0.75rem',
                background: '#1a1a1a',
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

          {/* Empty state */}
          {!loading && !error && files.length === 0 && (
            <div
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                gap: '1rem',
                textAlign: 'center',
                color: '#d4d4d4',
                background: '#1a1a1a'
              }}
            >
              <div style={{ fontSize: '2rem' }}>📁</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No media files found</div>
              <div style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>
                This folder doesn't contain any images or videos.
              </div>
            </div>
          )}

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
              /* Responsive grid - Mobile: 2 columns, Tablet: 3, Small laptop: 4, Large: 4 */
              @media (max-width: 480px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 0.5rem !important;
                  padding: 0.5rem !important;
                }
                .thumbnail-image-container {
                  height: 160px !important;
                }
                .drive-tile {
                  border-radius: 0.5rem !important;
                }
              }
              @media (min-width: 481px) and (max-width: 900px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(3, 1fr) !important;
                  gap: 0.75rem !important;
                  padding: 0.75rem !important;
                }
                .thumbnail-image-container {
                  height: 200px !important;
                }
              }
              @media (min-width: 901px) and (max-width: 1200px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(4, 1fr) !important;
                  gap: 1rem !important;
                  padding: 1rem !important;
                }
                .thumbnail-image-container {
                  height: 240px !important;
                }
              }
              @media (min-width: 1201px) {
                .drive-gallery-grid {
                  grid-template-columns: repeat(4, 1fr) !important;
                  gap: 1rem !important;
                  padding: 1rem !important;
                  max-width: 1400px !important;
                  margin: 0 auto !important;
                }
                .thumbnail-image-container {
                  height: 240px !important;
                }
              }
              /* Responsive browser window elements */
              @media (max-width: 640px) {
                .drive-mockup-wrapper {
                  border-width: 1px !important;
                  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.1), 0 5px 5px -5px rgba(126, 34, 206, 0.3), 0 0 10px rgba(122, 66, 240, 0.2) !important;
                }
                .browser-dots > div {
                  width: 8px !important;
                  height: 8px !important;
                }
                .browser-label {
                  font-size: 0.625rem !important;
                }
                .thumbnail-filename {
                  font-size: 0.625rem !important;
                  padding: 0.375rem !important;
                }
              }
              @media (min-width: 641px) {
                .thumbnail-filename {
                  font-size: 0.75rem !important;
                }
              }
              @media (min-width: 768px) {
                .thumbnail-filename {
                  font-size: 0.875rem !important;
                }
              }
              /* Custom scrollbar for dark theme */
              .drive-mockup-wrapper [style*="overflow: auto"]::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .drive-mockup-wrapper [style*="overflow: auto"]::-webkit-scrollbar-track {
                background: #1a1a1a;
              }
              .drive-mockup-wrapper [style*="overflow: auto"]::-webkit-scrollbar-thumb {
                background: rgba(122, 66, 240, 0.5);
                border-radius: 4px;
              }
              .drive-mockup-wrapper [style*="overflow: auto"]::-webkit-scrollbar-thumb:hover {
                background: rgba(122, 66, 240, 0.7);
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
