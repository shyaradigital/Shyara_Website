/**
 * Hydration Safety Utilities
 * Ensures safe rendering before hydration and DOM readiness
 */

/**
 * Check if DOM is ready for rendering
 * @returns {boolean} - True if DOM is ready
 */
export const isDOMReady = () => {
  if (typeof window === 'undefined') return false;
  return document.readyState === 'complete' || document.readyState === 'interactive';
};

/**
 * Check if fonts are loaded
 * @returns {Promise<boolean>} - Promise that resolves when fonts are loaded
 */
export const waitForFonts = () => {
  if (typeof window === 'undefined' || !document.fonts) {
    return Promise.resolve(true);
  }

  return document.fonts.ready
    .then(() => true)
    .catch(() => {
      // Fallback: wait a short time if fonts API fails
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 100);
      });
    });
};

/**
 * Wait for DOM to be ready
 * @returns {Promise<void>} - Promise that resolves when DOM is ready
 */
export const waitForDOM = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (isDOMReady()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    } else {
      resolve();
    }
  });
};

/**
 * Wait for both DOM and fonts to be ready
 * @returns {Promise<void>} - Promise that resolves when both are ready
 */
export const waitForHydration = async () => {
  await waitForDOM();
  await waitForFonts();
  // Small additional delay to ensure layout is calculated
  await new Promise((resolve) => setTimeout(resolve, 50));
};

/**
 * Check if a container has valid dimensions
 * @param {HTMLElement|null} element - Element to check
 * @returns {boolean} - True if element has valid dimensions
 */
export const hasValidDimensions = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && element.offsetParent !== null;
};

/**
 * Safe render helper - ensures content is sanitized before rendering
 * @param {string} content - Content to render safely
 * @param {Function} sanitizeFn - Sanitization function to apply
 * @returns {string} - Sanitized content
 */
export const safeRender = (content, sanitizeFn) => {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  if (typeof sanitizeFn === 'function') {
    return sanitizeFn(content);
  }
  
  // Default: escape HTML
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

