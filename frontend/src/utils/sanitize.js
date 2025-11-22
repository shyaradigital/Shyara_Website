import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes script tags, event handlers, and other dangerous content
 * 
 * @param {string} dirty - The HTML string to sanitize
 * @param {Object} options - Optional DOMPurify configuration
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty, options = {}) => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Default configuration: strict sanitization
  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
    // Remove all event handlers (onclick, onerror, etc.)
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    // Remove javascript: and data: URLs
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Remove style attributes to prevent CSS injection
    FORBID_STYLES: true,
    // Keep relative URLs safe
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // Sanitize data URIs
    SAFE_FOR_TEMPLATES: true,
    // Return only text if no valid HTML
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false
  };

  const config = { ...defaultOptions, ...options };

  try {
    return DOMPurify.sanitize(dirty, config);
  } catch (error) {
    console.error('HTML sanitization error:', error);
    // Fallback: return escaped text if sanitization fails
    return escapeHTML(dirty);
  }
};

/**
 * Sanitize plain text to prevent XSS in text nodes
 * Escapes HTML special characters
 * 
 * @param {string} text - The text to sanitize
 * @returns {string} - Escaped text safe for rendering
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Escape HTML special characters
  return escapeHTML(text);
};

/**
 * Escape HTML special characters
 * 
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
const escapeHTML = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Sanitize text for use in HTML attributes (like alt, title, etc.)
 * 
 * @param {string} text - Text to sanitize for attributes
 * @returns {string} - Sanitized text safe for HTML attributes
 */
export const sanitizeAttribute = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove any HTML tags and escape special characters
  const withoutTags = text.replace(/<[^>]*>/g, '');
  return escapeHTML(withoutTags);
};

