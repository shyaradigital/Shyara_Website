/**
 * URL Validation and Sanitization Utilities
 * Validates URLs before using them in unsafe contexts (iframe, window.open, etc.)
 */

/**
 * Check if a URL is safe for iframe embedding
 * Only allows same-origin or trusted domains
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is safe
 */
export const isSafeIframeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    // Parse the URL
    const urlObj = new URL(url, window.location.origin);
    
    // Allow same-origin URLs
    if (urlObj.origin === window.location.origin) {
      return true;
    }
    
    // Block javascript:, data:, and other dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.some(proto => urlObj.href.toLowerCase().startsWith(proto))) {
      return false;
    }
    
    // For now, only allow same-origin
    // If you need to allow specific external domains, whitelist them here
    return false;
  } catch (error) {
    // Invalid URL
    return false;
  }
};

/**
 * Check if a URL is safe for window.open
 * Allows same-origin and trusted external domains
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is safe
 */
export const isSafeWindowOpenUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    // Parse the URL
    const urlObj = new URL(url, window.location.origin);
    
    // Allow same-origin URLs
    if (urlObj.origin === window.location.origin) {
      return true;
    }
    
    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.some(proto => urlObj.href.toLowerCase().startsWith(proto))) {
      return false;
    }
    
    // Allow http/https URLs (external links are generally safe with noopener)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    // Invalid URL - try relative URL
    // Relative URLs are safe if they don't contain dangerous patterns
    if (!url.includes('javascript:') && !url.includes('data:') && !url.includes('://')) {
      return true;
    }
    return false;
  }
};

/**
 * Sanitize URL for safe use
 * Removes dangerous protocols and patterns
 * 
 * @param {string} url - URL to sanitize
 * @returns {string|null} - Sanitized URL or null if unsafe
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase().trim();
  
  if (dangerousProtocols.some(proto => lowerUrl.startsWith(proto))) {
    return null;
  }

  // Remove null bytes and control characters
  const cleaned = url.replace(/[\x00-\x1F\x7F]/g, '');
  
  return cleaned;
};

/**
 * Validate and sanitize URL for iframe src
 * 
 * @param {string} url - URL to validate
 * @returns {string|null} - Safe URL or null
 */
export const validateIframeUrl = (url) => {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) {
    return null;
  }
  
  if (isSafeIframeUrl(sanitized)) {
    return sanitized;
  }
  
  return null;
};

/**
 * Validate and sanitize URL for window.open
 * 
 * @param {string} url - URL to validate
 * @returns {string|null} - Safe URL or null
 */
export const validateWindowOpenUrl = (url) => {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) {
    return null;
  }
  
  if (isSafeWindowOpenUrl(sanitized)) {
    return sanitized;
  }
  
  return null;
};

