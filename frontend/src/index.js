import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './style.css';

// Suppress WebGL errors in console
const originalError = console.error;
console.error = (...args) => {
  // Filter out WebGL-related errors
  const message = args.join(' ');
  if (message.includes('WebGL') || 
      message.includes('GL_INVALID_VALUE') || 
      message.includes('GL_INVALID_FRAMEBUFFER_OPERATION') ||
      message.includes('Framebuffer is incomplete') ||
      message.includes('Texture dimensions must all be greater than zero') ||
      message.includes('glTexStorage2D') ||
      message.includes('glClear') ||
      message.includes('glClearBufferfv') ||
      message.includes('glDrawElements') ||
      message.includes('glDrawArrays') ||
      message.includes('Attachment has zero size') ||
      message.includes('too many errors, no more errors will be reported')) {
    return; // Don't log WebGL errors
  }
  originalError.apply(console, args);
};

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
