import React, { useState } from 'react';
import Layout from '../components/Layout';

/**
 * Test Drive Page
 * 
 * Minimal test page to verify Google Drive iframe embedding works.
 * This helps isolate iframe loading issues from modal styling.
 */
const TestDrive = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // SMM folder ID for testing
  const testFolderId = '1AUVLMsKOhDkiE4gzPPI84cY19Wo5BVvT';
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${testFolderId}#grid`;

  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'rgba(5, 5, 12, 1)',
        color: '#e7e7e7'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            color: '#a259f7',
            fontSize: '2rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Google Drive Iframe Test
          </h1>
          
          <p style={{
            color: '#a7a7a7',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '1rem'
          }}>
            This is a minimal test page to verify Google Drive folder embedding.
            <br />
            If this loads, the issue is with modal styling. If not, check folder permissions.
          </p>

          <div style={{
            background: '#fff',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            border: '2px solid rgba(126, 34, 206, 0.3)'
          }}>
            <div style={{
              marginBottom: '0.5rem',
              color: '#333',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Test URL:
            </div>
            <code style={{
              color: '#a259f7',
              fontSize: '0.85rem',
              wordBreak: 'break-all',
              background: 'rgba(162, 89, 247, 0.1)',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              display: 'block'
            }}>
              {embedUrl}
            </code>
          </div>

          {/* Loading indicator */}
          {!iframeLoaded && !iframeError && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'rgba(196, 181, 253, 0.8)',
              background: 'rgba(10, 10, 10, 0.5)',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(196, 181, 253, 0.3)',
                borderTop: '3px solid rgba(196, 181, 253, 0.8)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              Loading Google Drive folder...
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: 'rgba(212, 212, 212, 0.6)'
              }}>
                Ensure the folder is set to "Anyone with the link can view"
              </div>
            </div>
          )}

          {/* Error message */}
          {iframeError && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'rgba(239, 68, 68, 0.8)',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              ⚠️ Unable to load Google Drive folder
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                color: 'rgba(212, 212, 212, 0.7)'
              }}>
                Please ensure the folder is publicly shared
              </div>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  color: 'rgba(196, 181, 253, 0.8)',
                  textDecoration: 'underline',
                  fontSize: '0.9rem'
                }}
              >
                Open in new tab to verify
              </a>
            </div>
          )}

          {/* Iframe container */}
          <div style={{
            position: 'relative',
            width: '100%',
            background: '#fff',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            border: '2px solid rgba(126, 34, 206, 0.3)',
            minHeight: '80vh'
          }}>
            <iframe
              src={embedUrl}
              style={{
                width: '100%',
                height: '80vh',
                border: '0',
                display: 'block',
                opacity: iframeLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
              frameBorder="0"
              loading="lazy"
              allow="cross-origin; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
              onLoad={() => {
                setIframeLoaded(true);
                setIframeError(false);
              }}
              onError={() => {
                setIframeError(true);
                setIframeLoaded(false);
              }}
              title="Google Drive Test Folder"
              allowFullScreen
            />
          </div>

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(162, 89, 247, 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(162, 89, 247, 0.3)'
          }}>
            <h3 style={{
              color: '#c4b5fd',
              fontSize: '1.1rem',
              marginBottom: '0.5rem'
            }}>
              Troubleshooting:
            </h3>
            <ul style={{
              color: '#a7a7a7',
              fontSize: '0.9rem',
              lineHeight: 1.8,
              paddingLeft: '1.5rem'
            }}>
              <li>Verify the folder ID is correct: {testFolderId}</li>
              <li>Ensure the Google Drive folder is set to "Anyone with the link can view"</li>
              <li>Check browser console for any CORS or security errors</li>
              <li>Try opening the URL directly in a new tab to verify it works</li>
              <li>If this test page works but the modal doesn't, the issue is with modal styling</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestDrive;

