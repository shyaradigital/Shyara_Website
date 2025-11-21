import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './style.css';

// Enhanced console filtering - catch everything
(function() {
  const _e = console.error.bind(console);
  const _w = console.warn.bind(console);
  const _l = console.log.bind(console);
  const _i = console.info.bind(console);

  const filterPatterns = [
    'WebGL', 'GL_INVALID', 'Framebuffer', 'glTexStorage', 'glClear', 
    'glDraw', 'Attachment has zero size', 'too many errors',
    'Tracking Prevention', 'emailjs', 'cdn.jsdelivr.net', 
    'blocked access', 'updating from', 'spline', 'React DevTools'
  ];

  const shouldFilter = (...args) => {
    const str = args.map(a => String(a || '')).join(' ');
    return filterPatterns.some(p => str.includes(p));
  };

  console.error = (...args) => { if (!shouldFilter(...args)) _e(...args); };
  console.warn = (...args) => { if (!shouldFilter(...args)) _w(...args); };
  console.log = (...args) => { if (!shouldFilter(...args)) _l(...args); };
  console.info = (...args) => { if (!shouldFilter(...args)) _i(...args); };
  
  // Show clean startup message
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      _l('%c🎨 Shyara Portfolio', 'color: #a259f7; font-weight: bold; font-size: 16px; padding: 4px 0;');
      _l('%c✓ Console filters active', 'color: #4ade80; font-size: 12px;');
    }, 200);
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
