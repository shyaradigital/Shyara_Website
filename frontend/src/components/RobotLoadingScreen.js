import React, { useState, useEffect } from 'react';

const RobotLoadingScreen = ({ showFallbackMessage = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    'Crafting Creativity...',
    'Preparing Magic...',
    'Shaping Your Vision...',
    'Building Something Amazing...',
  ];

  // Rotate messages every 2 seconds
  useEffect(() => {
    if (!showFallbackMessage) return;
    
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [showFallbackMessage, messages.length]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="robot-loading-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
        willChange: 'opacity',
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Loading content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        {/* Shyara Logo/Brand */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Outer pulsing ring */}
          <div
            className="loading-ring-outer"
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '3px solid rgba(187, 106, 255, 0.3)',
              animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              willChange: 'transform, opacity',
            }}
          />
          
          {/* Middle glowing ring */}
          <div
            className="loading-ring-middle"
            style={{
              position: 'absolute',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: '2px solid rgba(187, 106, 255, 0.5)',
              boxShadow: '0 0 30px rgba(187, 106, 255, 0.4)',
              animation: 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.3s',
              willChange: 'transform, opacity',
            }}
          />

          {/* Inner rotating ring */}
          <div
            className="loading-ring-inner"
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTop: '2px solid #bb6aff',
              borderRight: '2px solid #bb6aff',
              animation: 'spin 1s linear infinite',
              willChange: 'transform',
            }}
          />

          {/* Center logo text */}
          <div
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#bb6aff',
              letterSpacing: '0.1em',
              textShadow: '0 0 20px rgba(187, 106, 255, 0.5)',
              animation: 'pulse-glow 2s ease-in-out infinite',
              willChange: 'transform, opacity',
              fontFamily: 'Salena, system-ui, sans-serif',
            }}
          >
            SHYARA
          </div>
        </div>

        {/* Rotating tagline */}
        <div
          style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '400',
            letterSpacing: '0.05em',
            textAlign: 'center',
            minHeight: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.3s ease',
          }}
        >
          {showFallbackMessage ? messages[currentMessage] : messages[0]}
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
              text-shadow: 0 0 20px rgba(187, 106, 255, 0.5);
            }
            50% {
              transform: scale(1.05);
              opacity: 0.9;
              text-shadow: 0 0 30px rgba(187, 106, 255, 0.7);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default RobotLoadingScreen;

