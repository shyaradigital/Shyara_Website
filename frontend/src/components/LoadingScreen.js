import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Original 3-second delay before starting animation
    let zoomTimer;
    let finishTimer;
    
    const timer = setTimeout(() => {
      // Start zoom animation
      setIsZoomed(true);
      
      // After zoom animation completes, hide and call onFinish
      finishTimer = setTimeout(() => {
        setIsVisible(false);
        // Restore navbar before calling onFinish
        const nav = document.querySelector('header');
        if (nav) {
          nav.style.display = '';
        }
        if (onFinish) onFinish();
      }, 2500); // Match the transition duration
    }, 3000); // Original 3-second delay

    return () => {
      clearTimeout(timer);
      if (zoomTimer) clearTimeout(zoomTimer);
      if (finishTimer) clearTimeout(finishTimer);
      // Ensure navbar is restored on cleanup
      const nav = document.querySelector('header');
      if (nav) {
        nav.style.display = '';
      }
    };
  }, [onFinish]);

  // Hide navigation during loading (original behavior)
  useEffect(() => {
    if (isVisible) {
      const nav = document.querySelector('header');
      if (nav) {
        nav.style.display = 'none';
      }
    }
    
    // Cleanup: restore navbar when component unmounts
    return () => {
      const nav = document.querySelector('header');
      if (nav) {
        nav.style.display = '';
      }
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="loading-screen"
      className="loading-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        opacity: isZoomed ? 0.05 : 1,
        transform: isZoomed ? 'scale(3)' : 'scale(1)',
        transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div className="loading-content">
        <h1 
          className="loading-text"
          style={{
            animation: 'pulse 1.2s ease-in-out infinite, glow 1.8s ease-in-out infinite'
          }}
        >
          SHYARA
        </h1>
      </div>
    </div>
  );
};

export default LoadingScreen; 