import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './style.css';

// Import console suppression utility (runs immediately on import)
import './utils/consoleSuppression';

// Hydration safety: Wait for DOM and fonts before rendering
import { waitForHydration } from './utils/hydration';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Wait for hydration before rendering
waitForHydration().then(() => {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('Hydration failed:', error);
  // Fallback: render anyway after a delay
  setTimeout(() => {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }, 500);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
