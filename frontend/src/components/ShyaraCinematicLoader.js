import React, { useState, useEffect } from 'react';

const ShyaraCinematicLoader = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [messageOpacity, setMessageOpacity] = useState(1);
  const [startTime] = useState(Date.now());

  const messages = [
    'Crafting Creativity...',
    'Designing Future Brands...',
    'Shaping Your Digital Presence...',
    'Loading Your Experience...',
    'Preparing Magic...',
  ];

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide loader after 1.5s maximum, but ensure minimum 800ms
  useEffect(() => {
    const maxTime = 1500; // Maximum 1500ms
    
    // Hide after maximum time (ensures minimum 800ms is met since maxTime > 800ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade-out animation before unmounting
      setTimeout(() => {
        setShouldUnmount(true);
        if (onFinish) onFinish();
      }, 300);
    }, maxTime);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Rotate messages with smooth fade transitions
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setMessageOpacity(0);
      
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        // Fade in
        setMessageOpacity(1);
      }, 300);
    }, 1400);

    return () => clearInterval(interval);
  }, [messages.length]);

  // Early return after all hooks
  if (shouldUnmount) {
    return null;
  }

  return (
    <>
      <div
        className="shyara-cinematic-loader"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          background: 'radial-gradient(circle at center, #0b0b0b 0%, #000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: 'auto',
        }}
      >
        {/* Content Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3rem',
          }}
        >
          {/* Orbital Rings Container */}
          <div
            style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer Ring - Rotates Clockwise */}
            <div
              className="orbital-ring outer-ring"
              style={{
                position: 'absolute',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                border: '1px solid rgba(162, 89, 255, 0.4)',
                boxShadow: '0 0 20px rgba(162, 89, 255, 0.2)',
                animation: 'rotate-clockwise 8s linear infinite',
                filter: 'blur(0.5px)',
                willChange: 'transform',
              }}
            />

            {/* Inner Ring - Rotates Counter-Clockwise */}
            <div
              className="orbital-ring inner-ring"
              style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                border: '1px solid rgba(162, 89, 255, 0.35)',
                boxShadow: '0 0 15px rgba(162, 89, 255, 0.15)',
                animation: 'rotate-counter-clockwise 6s linear infinite',
                filter: 'blur(0.5px)',
                willChange: 'transform',
              }}
            />

            {/* Logo with Glow Effect */}
            <div
              className="shyara-logo-glow"
              style={{
                fontSize: '4rem',
                fontWeight: '700',
                color: '#A259FF',
                letterSpacing: '0.15em',
                textShadow: `
                  0 0 10px rgba(162, 89, 255, 0.8),
                  0 0 20px rgba(162, 89, 255, 0.6),
                  0 0 30px rgba(162, 89, 255, 0.4),
                  0 0 40px rgba(162, 89, 255, 0.2)
                `,
                animation: 'logo-pulse 2s ease-in-out infinite',
                willChange: 'transform',
                fontFamily: 'Salena, system-ui, sans-serif',
                zIndex: 1,
              }}
            >
              SHYARA
            </div>
          </div>

          {/* Rotating Taglines */}
          <div
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '400',
              letterSpacing: '0.08em',
              textAlign: 'center',
              minHeight: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: messageOpacity,
              transition: 'opacity 0.3s ease-in-out',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            {messages[currentMessage]}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes rotate-clockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes rotate-counter-clockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        @keyframes logo-pulse {
          0%, 100% {
            transform: scale(1);
            text-shadow: 
              0 0 10px rgba(162, 89, 255, 0.8),
              0 0 20px rgba(162, 89, 255, 0.6),
              0 0 30px rgba(162, 89, 255, 0.4),
              0 0 40px rgba(162, 89, 255, 0.2);
          }
          50% {
            transform: scale(1.04);
            text-shadow: 
              0 0 15px rgba(162, 89, 255, 1),
              0 0 30px rgba(162, 89, 255, 0.8),
              0 0 45px rgba(162, 89, 255, 0.6),
              0 0 60px rgba(162, 89, 255, 0.4);
          }
        }
      `}</style>
    </>
  );
};

export default ShyaraCinematicLoader;

