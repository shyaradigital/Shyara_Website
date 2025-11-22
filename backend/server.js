// Load environment variables
// In production (Render), environment variables are set directly in the platform
// In development, load from .env file using dotenv
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

// Only load dotenv in development - production reads from platform environment variables
const nodeEnv = process.env.NODE_ENV || '';
const isProduction = nodeEnv === 'production';

// ============================================================================
// Logger Configuration
// ============================================================================

// Create Winston logger with production-safe configuration
const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: !isProduction }), // Stack traces only in development
    winston.format.json()
  ),
  defaultMeta: { service: 'shyara-backend' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: isProduction
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
              let log = `${timestamp} [${level}]`;
              if (requestId) log += ` [${requestId}]`;
              log += `: ${message}`;
              if (Object.keys(meta).length > 0) {
                log += ` ${JSON.stringify(meta)}`;
              }
              return log;
            })
          )
    })
  ]
});

// Export logger for use in routes
module.exports = { logger };

// Validate NODE_ENV value - warn if invalid but don't crash
if (nodeEnv && nodeEnv !== 'production' && nodeEnv !== 'development') {
  logger.warn(`NODE_ENV is set to "${nodeEnv}" (expected 'production' or 'development')`);
  logger.warn('Security-critical behavior is based on NODE_ENV === "production"');
  logger.warn('Please set NODE_ENV to either "production" or "development"');
}

if (nodeEnv !== 'production') {
  // Development mode: Try multiple locations for .env file
  const possibleEnvPaths = [
    path.join(__dirname, '.env'),           // Same directory as server.js
    path.join(__dirname, '..', '.env'),     // Parent directory
    path.join(process.cwd(), '.env'),       // Current working directory
    path.join(process.cwd(), 'backend', '.env') // backend subdirectory from root
  ];

  let envLoaded = false;
  for (const envPath of possibleEnvPaths) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      logger.info('Loaded .env file', { path: envPath });
      envLoaded = true;
      break;
    }
  }

  if (!envLoaded) {
    // Try default dotenv behavior (looks for .env in current directory)
    require('dotenv').config();
    logger.info('No .env file found, using process.env');
  }
} else {
  // Production mode: Use process.env directly (platform sets these automatically)
  // Do NOT load dotenv in production - platform provides environment variables
  logger.info('Production mode: Using environment variables from platform');
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();

// Disable X-Powered-By header to hide Express framework information
app.disable('x-powered-by');

// Use different port in development (3001) to avoid conflict with React dev server (3000)
// In production, use PORT from environment or default to 3000
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

// ============================================================================
// Secure Response Wrapper - Prevents information leakage
// ============================================================================

// Sanitize error messages for production
const sanitizeError = (error) => {
  if (!error) return null;
  
  // If it's already a string, return it (assumed to be safe)
  if (typeof error === 'string') {
    return error;
  }
  
  // If it's an Error object
  if (error instanceof Error) {
    // In production, return generic message
    if (isProduction) {
      // Check if it's a known safe error message
      const safeMessages = [
        'not found',
        'required',
        'invalid',
        'too long',
        'too short',
        'cannot be empty',
        'not configured'
      ];
      
      const lowerMessage = error.message.toLowerCase();
      const isSafe = safeMessages.some(safe => lowerMessage.includes(safe));
      
      if (isSafe) {
        return error.message;
      }
      
      // Generic error for unknown errors
      return 'An error occurred processing your request.';
    }
    
    // Development: return full error message
    return error.message;
  }
  
  // If it's an object, try to extract a message
  if (typeof error === 'object' && error.message) {
    return sanitizeError(error.message);
  }
  
  // Fallback: convert to string
  return String(error);
};

// Secure response wrapper - ensures consistent format and prevents information leakage
const secureResponse = {
  // Success response
  success: (res, data = null, statusCode = 200) => {
    const response = {
      success: true
    };
    
    if (data !== null && data !== undefined) {
      response.data = data;
    }
    
    return res.status(statusCode).json(response);
  },
  
  // Error response
  error: (res, error, statusCode = 500, data = null) => {
    const response = {
      success: false,
      error: sanitizeError(error)
    };
    
    // Only include data in error responses if provided (for validation errors, etc.)
    if (data !== null && data !== undefined) {
      response.data = data;
    }
    
    // In development, include additional error details if available
    if (!isProduction && error instanceof Error && error.stack) {
      response._debug = {
        stack: error.stack,
        name: error.name
      };
    }
    
    return res.status(statusCode).json(response);
  }
};

// ============================================================================
// Request ID Middleware - Add unique ID to each request
// ============================================================================
app.use((req, res, next) => {
  // Generate or use existing request ID from header (for distributed tracing)
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ============================================================================
// CSP Nonce Generation Middleware - Generate unique nonce per request
// ============================================================================
app.use((req, res, next) => {
  // Generate a cryptographically secure random nonce for this request
  // This nonce will be used in CSP headers and injected into HTML
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  next();
});

// ============================================================================
// Request Logging Middleware - Log method, path, status, response time
// ============================================================================
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log request start (development only)
  if (!isProduction) {
    logger.debug('Incoming request', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      ip: req.ip || req.connection.remoteAddress
    });
  }
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    // Log request completion
    const logData = {
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      responseTime: `${responseTime}ms`
    };
    
    // Only log API routes in production (to reduce noise)
    if (req.path.startsWith('/api')) {
      if (res.statusCode >= 500) {
        logger.error('Request completed with error', logData);
      } else if (res.statusCode >= 400) {
        logger.warn('Request completed with client error', logData);
      } else {
        logger.info('Request completed', logData);
      }
    } else if (!isProduction) {
      // Log all routes in development
      logger.debug('Request completed', logData);
    }
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

// Configure Helmet with Content Security Policy
// Strict CSP in production, relaxed in development
// Uses nonces to allow only authorized inline scripts
if (isProduction) {
  // Production: Strict CSP with nonces
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce}'`, // Nonce for inline scripts
          "https://cdn.jsdelivr.net", // EmailJS (if still used)
          "https://unpkg.com", // Spline viewer
          "'unsafe-eval'" // Required for Spline 3D viewer (uses new Function() for dynamic code compilation)
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'" // Required for React inline styles and CSS-in-JS
        ],
        imgSrc: [
          "'self'",
          "data:", // Base64 images
          "https://lh3.googleusercontent.com", // Google Drive images
          "https://*.googleusercontent.com" // Google Drive images (wildcard)
        ],
        connectSrc: [
          "'self'",
          "https://api.emailjs.com", // EmailJS API
          "https://*.googleapis.com", // Google Drive API
          "https://prod.spline.design", // Spline 3D model CDN
          "https://*.spline.design" // Spline 3D model CDN (wildcard)
        ],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [] // Upgrade HTTP to HTTPS
      }
    },
    // Security headers
    xFrameOptions: { action: 'deny' }, // X-Frame-Options: DENY - Prevent clickjacking
    xContentTypeOptions: true, // X-Content-Type-Options: nosniff - Prevent MIME type sniffing
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Referrer-Policy: strict-origin-when-cross-origin
    hidePoweredBy: true, // Remove X-Powered-By header (redundant with app.disable, but ensures it's removed)
    // HSTS (HTTP Strict Transport Security) - Production only
    // Forces browsers to use HTTPS for all future requests to this domain and subdomains
    strictTransportSecurity: {
      maxAge: 63072000, // 2 years in seconds
      includeSubDomains: true, // Apply to all subdomains
      preload: true // Enable HSTS preload (allows inclusion in browser preload lists)
    },
    crossOriginEmbedderPolicy: false, // Allow embedding (needed for some external resources)
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin resources (Google Drive images)
  }));
} else {
  // Development: Relaxed CSP for easier debugging (still use nonces for consistency)
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce}'`, // Nonce for inline scripts
          "'unsafe-eval'", // Allow eval for React dev tools and hot reloading
          "https://cdn.jsdelivr.net",
          "https://unpkg.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://lh3.googleusercontent.com",
          "https://*.googleusercontent.com"
        ],
        connectSrc: [
          "'self'",
          "http://localhost:*", // Allow localhost connections for dev server
          "ws://localhost:*", // WebSocket for hot reloading
          "https://api.emailjs.com",
          "https://*.googleapis.com",
          "https://prod.spline.design", // Spline 3D model CDN
          "https://*.spline.design" // Spline 3D model CDN (wildcard)
        ],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    // Security headers (same as production for consistency)
    xFrameOptions: { action: 'deny' }, // X-Frame-Options: DENY
    xContentTypeOptions: true, // X-Content-Type-Options: nosniff
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Referrer-Policy: strict-origin-when-cross-origin
    hidePoweredBy: true, // Remove X-Powered-By header
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
}

// Configure CORS with strict rules
// Production: Only allow specific trusted origins
// Development: Allow all origins for local development
if (isProduction) {
  // Production: Strict CORS - only allow shyara.co.in domains
  const allowedOrigins = [
    'https://shyara.co.in',
    'https://www.shyara.co.in'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (same-origin requests don't send Origin header)
      // CORS only applies to cross-origin requests
      if (!origin) {
        return callback(null, true);
      }
      
      // Strictly validate cross-origin requests - only allow trusted domains
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Log blocked origin in production (for monitoring)
        if (nodeEnv === 'production') {
          logger.warn('CORS: Blocked request from origin', { origin });
        }
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'], // Only allow GET and POST
    allowedHeaders: [
      'Content-Type',
      'Authorization' // Allow Authorization header for potential future use
    ],
    exposedHeaders: [],
    credentials: false, // Don't allow credentials
    maxAge: 86400 // Cache preflight requests for 24 hours
  }));
} else {
  // Development: Relaxed CORS for local development
  app.use(cors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common methods for dev
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 86400
  }));
}

// Middleware for parsing JSON (must come before routes)
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size

// ============================================================================
// Input Validation & Sanitization Middleware
// ============================================================================

// Maximum length limits for different input types
const MAX_LENGTHS = {
  string: 10000,        // General string max length
  name: 100,            // Name fields
  email: 254,           // Email (RFC 5321)
  message: 2000,        // Message/description fields
  phone: 20,            // Phone numbers
  website: 200,         // Website URLs
  fileId: 100,          // File IDs (Google Drive)
  folderId: 100,        // Folder IDs (Google Drive)
  queryParam: 500,      // Query parameters
  pathParam: 200        // Path parameters
};

// Sanitize a string value
const sanitizeString = (value, maxLength = MAX_LENGTHS.string) => {
  if (typeof value !== 'string') {
    return value; // Return as-is if not a string (will be validated separately)
  }
  
  let sanitized = value
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove HTML tags (basic sanitization)
    .replace(/<[^>]*>/g, '')
    // Remove script tags and their content (case-insensitive)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: URLs (potential XSS vectors)
    .replace(/data:(.*?);base64,/gi, '')
    // Remove on* event handlers (onclick, onerror, etc.)
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    // Trim whitespace
    .trim();
  
  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// Sanitize an object recursively
const sanitizeObject = (obj, depth = 0) => {
  // Prevent deep nesting (max 10 levels)
  if (depth > 10) {
    return null;
  }
  
  // Prevent circular references
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    // Limit array size (max 100 items)
    if (obj.length > 100) {
      return obj.slice(0, 100).map(item => sanitizeObject(item, depth + 1));
    }
    return obj.map(item => sanitizeObject(item, depth + 1));
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    const sanitized = {};
    const keys = Object.keys(obj);
    
    // Limit number of keys (max 50)
    const limitedKeys = keys.slice(0, 50);
    
    for (const key of limitedKeys) {
      // Sanitize key name (remove special characters, limit length)
      const sanitizedKey = sanitizeString(String(key), 100);
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeObject(obj[key], depth + 1);
      }
    }
    
    return sanitized;
  }
  
  // Handle strings
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  // Handle numbers, booleans, etc. (validate type)
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  // Reject other types (functions, symbols, etc.)
  return null;
};

// Validate and sanitize URL parameters
const sanitizeParams = (params) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      // Determine max length based on parameter name
      let maxLength = MAX_LENGTHS.pathParam;
      if (key.toLowerCase().includes('fileid')) {
        maxLength = MAX_LENGTHS.fileId;
      } else if (key.toLowerCase().includes('folderid')) {
        maxLength = MAX_LENGTHS.folderId;
      }
      
      const sanitizedValue = sanitizeString(value, maxLength);
      if (sanitizedValue.length > 0) {
        sanitized[key] = sanitizedValue;
      }
    } else {
      // Reject non-string parameters
      sanitized[key] = null;
    }
  }
  
  return sanitized;
};

// Validate and sanitize query parameters
const sanitizeQuery = (query) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value, MAX_LENGTHS.queryParam);
    } else if (Array.isArray(value)) {
      // Handle array query parameters (e.g., ?tags=tag1&tags=tag2)
      sanitized[key] = value
        .slice(0, 20) // Limit array size
        .map(v => typeof v === 'string' ? sanitizeString(v, MAX_LENGTHS.queryParam) : null)
        .filter(v => v !== null);
    } else {
      // Reject other types
      sanitized[key] = null;
    }
  }
  
  return sanitized;
};

// Global input validation and sanitization middleware
const inputValidationMiddleware = (req, res, next) => {
  try {
    // Sanitize URL parameters
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitizeParams(req.params);
    }
    
    // Sanitize query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = sanitizeQuery(req.query);
    }
    
    // Sanitize request body (for POST, PUT, PATCH requests)
    if (req.body && typeof req.body === 'object') {
      const originalKeysCount = Object.keys(req.body).length;
      
      // Only process non-empty bodies (empty objects are allowed but won't be sanitized)
      if (originalKeysCount > 0) {
        // Check payload size before sanitization
        const payloadSize = JSON.stringify(req.body).length;
        const MAX_PAYLOAD_SIZE = 10000; // 10KB max
        
        if (payloadSize > MAX_PAYLOAD_SIZE) {
          return secureResponse.error(res, 'Request payload too large. Maximum size is 10KB.', 400);
        }
        
        // Sanitize body
        const sanitizedBody = sanitizeObject(req.body);
        
        // Check if sanitization removed everything (potential attack)
        // Only reject if body was non-empty but became null or empty after sanitization
        if (sanitizedBody === null || (typeof sanitizedBody === 'object' && originalKeysCount > 0 && Object.keys(sanitizedBody).length === 0)) {
          return secureResponse.error(res, 'Invalid request data.', 400);
        }
        
        req.body = sanitizedBody;
      }
    }
    
    next();
  } catch (error) {
    // Log error in development
    if (nodeEnv !== 'production') {
      logger.error('Input validation error', { 
        error: error.message, 
        stack: error.stack,
        requestId: req.id 
      });
    }
    
    return secureResponse.error(res, 'Invalid request data.', 400);
  }
};

// Apply input validation middleware globally to all API routes
app.use('/api', inputValidationMiddleware);

// Simple in-memory rate limiter for contact endpoint
const contactRateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of contactRateLimit.entries()) {
    if (now - data.resetTime > RATE_LIMIT_WINDOW) {
      contactRateLimit.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Helper function to get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         'unknown';
};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to sanitize string for logging (truncate and remove newlines)
const sanitizeForLog = (str, maxLength = 50) => {
  if (!str) return '';
  return String(str)
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .substring(0, maxLength);
};

// ============================================================================
// SSRF Protection: Validate Google Drive IDs
// ============================================================================

// Validate that a Google Drive ID is safe and cannot be used for SSRF attacks
// Google Drive IDs are alphanumeric strings, sometimes with hyphens/underscores
// This function ensures the ID cannot be used to construct malicious URLs
const isValidDriveId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // Google Drive IDs are typically 19-33 characters, but we'll allow up to 100
  // to be safe while still preventing extremely long inputs
  if (id.length === 0 || id.length > 100) {
    return false;
  }
  
  // Only allow alphanumeric characters, hyphens, and underscores
  // This prevents:
  // - URL schemes (http://, https://, file://, etc.)
  // - Path traversal (../, ./, etc.)
  // - Special characters that could be used for injection
  // - Dots (except as part of alphanumeric sequences)
  // - Slashes (/, \)
  // - Spaces, newlines, or other whitespace
  // - URL-encoded characters (%)
  // - Query string separators (?, &, =)
  const safeIdPattern = /^[a-zA-Z0-9_-]+$/;
  
  if (!safeIdPattern.test(id)) {
    return false;
  }
  
  // Additional checks for SSRF prevention:
  // Reject if it looks like a URL scheme (even if encoded)
  const lowerId = id.toLowerCase();
  const urlSchemes = ['http', 'https', 'file', 'ftp', 'data', 'javascript', 'vbscript'];
  for (const scheme of urlSchemes) {
    if (lowerId.includes(scheme)) {
      return false;
    }
  }
  
  // Reject if it contains suspicious patterns
  const suspiciousPatterns = [
    '://',           // URL scheme separator
    '..',            // Path traversal
    '%',             // URL encoding
    '?',             // Query string start
    '&',             // Query parameter separator
    '=',             // Key-value separator
    '#',             // Fragment identifier
    '|',             // Pipe (command injection)
    ';',             // Command separator
    '`',             // Command substitution
    '$',             // Variable expansion
    '(', ')',        // Command execution
    '<', '>',        // Redirection
    '"', "'",        // String delimiters
    '\n', '\r',      // Newlines
    ' ',             // Spaces
    '\t'             // Tabs
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (id.includes(pattern)) {
      return false;
    }
  }
  
  return true;
};

// Sanitize and validate a Google Drive ID, returning null if invalid
const validateAndSanitizeDriveId = (id, paramName = 'id') => {
  if (!id) {
    return null;
  }
  
  // Convert to string and trim
  const idString = String(id).trim();
  
  // Validate
  if (!isValidDriveId(idString)) {
    if (nodeEnv !== 'production') {
      logger.warn(`Invalid ${paramName} format`, { 
        paramName, 
        value: sanitizeForLog(idString, 50) 
      });
    }
    return null;
  }
  
  return idString;
};

// Note: Request logging is now handled by the request logging middleware above
// This middleware is no longer needed as Winston logger handles it

// API routes (must come before static file serving)
app.post('/api/contact', (req, res) => {
  try {
    const clientIP = getClientIP(req);
    
    // Rate limiting check
    const now = Date.now();
    const rateLimitData = contactRateLimit.get(clientIP);
    
    if (rateLimitData) {
      if (now - rateLimitData.resetTime < RATE_LIMIT_WINDOW) {
        rateLimitData.count++;
        if (rateLimitData.count > RATE_LIMIT_MAX_REQUESTS) {
          // Rate limit exceeded
          logger.warn('Rate limit exceeded', { 
            ip: clientIP, 
            requestId: req.id 
          });
          return secureResponse.error(res, 'Too many requests. Please try again later.', 429);
        }
      } else {
        // Reset window
        rateLimitData.count = 1;
        rateLimitData.resetTime = now;
      }
    } else {
      // First request from this IP
      contactRateLimit.set(clientIP, { count: 1, resetTime: now });
    }
    
    // Validate payload size (prevent very large payloads)
    const payloadSize = JSON.stringify(req.body).length;
    const MAX_PAYLOAD_SIZE = 10000; // 10KB max
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      return secureResponse.error(res, 'Request payload too large.', 400);
    }
    
    // Extract and validate fields
    const { name, email, message, phone, website, honeypot } = req.body;
    
    // Honeypot spam protection - if honeypot field is filled, reject silently
    if (honeypot && honeypot.trim() !== '') {
      // Log in development for debugging
      logger.warn('Honeypot field filled - potential spam', { 
        ip: clientIP, 
        requestId: req.id 
      });
      // Return success to avoid revealing honeypot
      return secureResponse.success(res);
    }
    
    // Validate required fields
    if (!name || !email || !message) {
      return secureResponse.error(res, 'All required fields must be provided.', 400);
    }
    
    // Validate field types and constraints
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return secureResponse.error(res, 'Invalid field types.', 400);
    }
    
    // Validate name: non-empty, trimmed, max 100 characters
    const nameTrimmed = name.trim();
    if (nameTrimmed.length === 0) {
      return secureResponse.error(res, 'Name cannot be empty.', 400);
    }
    if (nameTrimmed.length > 100) {
      return secureResponse.error(res, 'Name is too long (maximum 100 characters).', 400);
    }
    
    // Validate email: valid format, max 254 characters (RFC 5321)
    const emailTrimmed = email.trim();
    if (emailTrimmed.length === 0) {
      return secureResponse.error(res, 'Email cannot be empty.', 400);
    }
    if (emailTrimmed.length > 254) {
      return secureResponse.error(res, 'Email is too long.', 400);
    }
    if (!isValidEmail(emailTrimmed)) {
      return secureResponse.error(res, 'Invalid email format.', 400);
    }
    
    // Validate message: non-empty, trimmed, max 2000 characters
    const messageTrimmed = message.trim();
    if (messageTrimmed.length === 0) {
      return secureResponse.error(res, 'Message cannot be empty.', 400);
    }
    if (messageTrimmed.length > 2000) {
      return secureResponse.error(res, 'Message is too long (maximum 2000 characters).', 400);
    }
    if (messageTrimmed.length < 10) {
      return secureResponse.error(res, 'Message is too short (minimum 10 characters).', 400);
    }
    
    // Validate optional phone field if provided
    if (phone !== undefined && phone !== null) {
      if (typeof phone !== 'string') {
        return secureResponse.error(res, 'Invalid phone field type.', 400);
      }
      const phoneTrimmed = phone.trim();
      if (phoneTrimmed.length > 20) {
        return secureResponse.error(res, 'Phone number is too long.', 400);
      }
    }
    
    // Validate optional website field if provided (basic URL check)
    if (website !== undefined && website !== null) {
      if (typeof website !== 'string') {
        return secureResponse.error(res, 'Invalid website field type.', 400);
      }
      const websiteTrimmed = website.trim();
      if (websiteTrimmed.length > 200) {
        return secureResponse.error(res, 'Website URL is too long.', 400);
      }
    }
    
    // Reject any unexpected fields (whitelist approach)
    const allowedFields = ['name', 'email', 'message', 'phone', 'website', 'honeypot'];
    const receivedFields = Object.keys(req.body);
    const unexpectedFields = receivedFields.filter(field => !allowedFields.includes(field));
    
    if (unexpectedFields.length > 0) {
      // Log unexpected fields in development
      if (nodeEnv !== 'production') {
        logger.warn('Unexpected fields in contact form', { 
          unexpectedFields, 
          requestId: req.id 
        });
      }
      // Still process the request but ignore unexpected fields
    }
    
    // Safe logging (development only, sanitized) - NO request bodies in production
    if (nodeEnv !== 'production') {
      logger.info('Contact form submission', {
        requestId: req.id,
        name: sanitizeForLog(nameTrimmed),
        email: sanitizeForLog(emailTrimmed),
        messageLength: messageTrimmed.length,
        phone: phone ? sanitizeForLog(phone) : 'not provided',
        ip: clientIP
      });
    }
    
    // Success response
    return secureResponse.success(res);
    
  } catch (error) {
    // Safe error handling - no stack traces in production
    if (nodeEnv !== 'production') {
      logger.error('Contact form error', { 
        error: error.message, 
        stack: error.stack,
        requestId: req.id 
      });
      return secureResponse.error(res, error, 500);
    } else {
      logger.error('Contact form error', { 
        error: error.message,
        requestId: req.id 
      });
      return secureResponse.error(res, 'An error occurred processing your request.', 500);
    }
  }
});

// Email sending route using Nodemailer
app.post('/api/send-email', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    
    // Rate limiting check (reuse contact rate limiter)
    const now = Date.now();
    const rateLimitData = contactRateLimit.get(clientIP);
    
    if (rateLimitData) {
      if (now - rateLimitData.resetTime < RATE_LIMIT_WINDOW) {
        rateLimitData.count++;
        if (rateLimitData.count > RATE_LIMIT_MAX_REQUESTS) {
          logger.warn('Rate limit exceeded for send-email', { 
            ip: clientIP, 
            requestId: req.id 
          });
          return secureResponse.error(res, 'Too many requests. Please try again later.', 429);
        }
      } else {
        rateLimitData.count = 1;
        rateLimitData.resetTime = now;
      }
    } else {
      contactRateLimit.set(clientIP, { count: 1, resetTime: now });
    }
    
    // Validate payload size
    const payloadSize = JSON.stringify(req.body).length;
    const MAX_PAYLOAD_SIZE = 10000; // 10KB max
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      return secureResponse.error(res, 'Request payload too large.', 400);
    }
    
    // Extract and validate fields
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return secureResponse.error(res, 'All required fields (name, email, message) must be provided.', 400);
    }
    
    // Validate field types
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return secureResponse.error(res, 'Invalid field types.', 400);
    }
    
    // Validate and sanitize name
    const nameTrimmed = name.trim();
    if (nameTrimmed.length === 0) {
      return secureResponse.error(res, 'Name cannot be empty.', 400);
    }
    if (nameTrimmed.length > 100) {
      return secureResponse.error(res, 'Name is too long (maximum 100 characters).', 400);
    }
    
    // Validate and sanitize email
    const emailTrimmed = email.trim();
    if (emailTrimmed.length === 0) {
      return secureResponse.error(res, 'Email cannot be empty.', 400);
    }
    if (emailTrimmed.length > 254) {
      return secureResponse.error(res, 'Email is too long.', 400);
    }
    if (!isValidEmail(emailTrimmed)) {
      return secureResponse.error(res, 'Invalid email format.', 400);
    }
    
    // Validate and sanitize message
    const messageTrimmed = message.trim();
    if (messageTrimmed.length === 0) {
      return secureResponse.error(res, 'Message cannot be empty.', 400);
    }
    if (messageTrimmed.length > 2000) {
      return secureResponse.error(res, 'Message is too long (maximum 2000 characters).', 400);
    }
    if (messageTrimmed.length < 10) {
      return secureResponse.error(res, 'Message is too short (minimum 10 characters).', 400);
    }
    
    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const smtpTo = process.env.SMTP_TO || 'support@shyara.co.in';
    
    // Debug: Log environment variable status in development
    if (nodeEnv !== 'production') {
      logger.debug('SMTP configuration check', {
        requestId: req.id,
        smtpHost: smtpHost ? 'SET' : 'MISSING',
        smtpPort: smtpPort ? 'SET' : 'MISSING',
        smtpUser: smtpUser ? 'SET' : 'MISSING',
        smtpPass: smtpPass ? 'SET' : 'MISSING',
        nodeEnv: nodeEnv || 'undefined',
        cwd: process.cwd(),
        __dirname: __dirname
      });
    }
    
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      logger.error('SMTP configuration missing', { 
        requestId: req.id,
        smtpHost: !!smtpHost,
        smtpPort: !!smtpPort,
        smtpUser: !!smtpUser,
        smtpPass: !!smtpPass
      });
      
      // In development, provide detailed instructions
      if (nodeEnv !== 'production') {
        const envPath = path.join(__dirname, '.env');
        const errorMessage = `Email service is not configured. 

Please create a .env file at: ${envPath}

Add the following variables:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=support@shyara.co.in

For Gmail:
1. Enable 2-Factor Authentication
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password) as SMTP_PASS

After creating .env, restart the backend server.`;
        return secureResponse.error(res, errorMessage, 500);
      } else {
        return secureResponse.error(res, 'Email service is not configured. Please contact support.', 500);
      }
    }
    
    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === '465', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
    
    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      logger.error('SMTP verification failed', { 
        error: verifyError.message, 
        requestId: req.id 
      });
      return secureResponse.error(res, 'Email service configuration error. Please contact support.', 500);
    }
    
    // Prepare email content
    const mailOptions = {
      from: `"${nameTrimmed}" <${smtpFrom}>`,
      replyTo: emailTrimmed,
      to: smtpTo,
      subject: `Contact Form: Message from ${nameTrimmed}`,
      text: `Name: ${nameTrimmed}\nEmail: ${emailTrimmed}\n\nMessage:\n${messageTrimmed}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a259f7;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${nameTrimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p><strong>Email:</strong> <a href="mailto:${emailTrimmed}">${emailTrimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a></p>
          </div>
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #a259f7; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${messageTrimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    };
    
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      
      // Safe logging (development only)
      if (nodeEnv !== 'production') {
        logger.info('Email sent successfully', {
          requestId: req.id,
          messageId: info.messageId,
          to: smtpTo,
          from: emailTrimmed
        });
      }
      
      return secureResponse.success(res, { 
        message: 'Message sent successfully!' 
      });
    } catch (sendError) {
      logger.error('Failed to send email', { 
        error: sendError.message, 
        requestId: req.id 
      });
      return secureResponse.error(res, 'Failed to send message. Please try again later.', 500);
    }
    
  } catch (error) {
    // Safe error handling - no stack traces in production
    if (nodeEnv !== 'production') {
      logger.error('Send email error', { 
        error: error.message, 
        stack: error.stack,
        requestId: req.id 
      });
      return secureResponse.error(res, error, 500);
    } else {
      return secureResponse.error(res, 'An error occurred while processing your request.', 500);
    }
  }
});

// Health check endpoint - minimal and safe for production monitoring
app.get('/api/health', (req, res) => {
  try {
    // Minimal health check response - no sensitive information
    return secureResponse.success(res, {
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Safe error handling - no stack traces in production
    if (nodeEnv !== 'production') {
      logger.error('Health check error', { 
        error: error.message, 
        stack: error.stack,
        requestId: req.id 
      });
    } else {
      logger.error('Health check error', { 
        error: error.message,
        requestId: req.id 
      });
    }
    return secureResponse.error(res, 'Health check failed', 500);
  }
});

// Google Drive Image Proxy - Streams images from Drive API to bypass CORS
// Endpoint: GET /api/drive-image/:fileId
// Uses ONLY: https://www.googleapis.com/drive/v3/files/FILE_ID?alt=media&key=API_KEY
app.get('/api/drive-image/:fileId', async (req, res) => {
  try {
    const { fileId: rawFileId } = req.params;
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    if (!apiKey) {
      if (nodeEnv !== 'production') {
        console.error('ERROR: Google Drive API key not configured');
      }
      return secureResponse.error(res, 'Google Drive API key not configured', 500);
    }

    // SSRF Protection: Validate and sanitize fileId
    const fileId = validateAndSanitizeDriveId(rawFileId, 'fileId');
    if (!fileId) {
      return secureResponse.error(res, 'Invalid file ID format. File ID must contain only letters, numbers, hyphens, and underscores.', 400);
    }

    // First, get file metadata to determine MIME type
    const metadataUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${apiKey}&fields=mimeType,name`;
    let mimeType = 'image/jpeg'; // Default fallback
    
    try {
      const metadataResponse = await fetch(metadataUrl);
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        mimeType = metadata.mimeType || 'image/jpeg';
      }
    } catch (metaError) {
      console.warn('Could not fetch metadata for file:', fileId, metaError.message);
    }

    // Google Drive API endpoint to get file content - ONLY this endpoint, no googleusercontent URLs
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

    // Log image proxying (development only)
    if (nodeEnv !== 'production') {
      console.log('📸 Proxying image request:', fileId, 'MIME:', mimeType);
    }

    // Fetch the image from Google Drive
    const response = await fetch(driveUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*'
      }
    });

    if (!response.ok) {
      if (nodeEnv !== 'production') {
        console.error('❌ Drive API error:', response.status, response.statusText, 'for file:', fileId);
      } else {
        console.error('Drive API error:', response.status, 'for file:', fileId);
      }
      
      // Return error placeholder image (1x1 transparent PNG as base64)
      const errorPlaceholder = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      // CORS headers are handled by the CORS middleware
      return res.status(200).send(errorPlaceholder);
    }

    // Get content type from Drive response (supports PNG, JPG, WEBP, etc.)
    const contentType = response.headers.get('content-type') || mimeType || 'image/jpeg';
    
    // Set appropriate headers for image streaming
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    // CORS headers are handled by the CORS middleware

    // Stream the image data directly to the response
    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Log success (development only)
    if (nodeEnv !== 'production') {
      console.log('✅ Image proxied successfully:', fileId, `(${buffer.length} bytes, ${contentType})`);
    }
    
    res.send(buffer);

  } catch (error) {
    if (nodeEnv !== 'production') {
      console.error('❌ Error proxying image:', error.message, 'for file:', req.params.fileId);
    } else {
      console.error('Error proxying image for file:', req.params.fileId);
    }
    
    // Return error placeholder on exception
    const errorPlaceholder = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    // CORS headers are handled by the CORS middleware
    return res.status(200).send(errorPlaceholder);
  }
});

// Test route - development only, disabled in production for security
app.get('/api/test', (req, res) => {
  try {
    // Disable in production - this is a debug endpoint
    if (isProduction) {
      return secureResponse.error(res, 'Not found', 404);
    }
    
    // Development only: Simple test response
    return secureResponse.success(res, { 
      status: 'ok', 
      message: 'API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Safe error handling - no stack traces in production
    if (nodeEnv !== 'production') {
      logger.error('Test endpoint error', { 
        error: error.message, 
        stack: error.stack,
        requestId: req.id 
      });
      return secureResponse.error(res, error, 500);
    } else {
      return secureResponse.error(res, 'Internal server error', 500);
    }
  }
});

// Google Drive API route - List files in a folder
app.get('/api/drive-list/:folderId', async (req, res) => {
  try {
    const { folderId: rawFolderId } = req.params;
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    // Debug: Check if API key is loaded (safe logging - no secrets exposed, dev only)
    if (nodeEnv !== 'production') {
      console.log('═══════════════════════════════════════════════════');
      console.log('🔑 API KEY DEBUG INFO:');
      console.log('  - API KEY PRESENT:', apiKey ? 'YES' : 'NO');
      // Do not log length, prefix, or any part of the API key
      console.log('  - FOLDER ID:', rawFolderId ? sanitizeForLog(rawFolderId, 50) : 'not provided');
      console.log('  - NODE_ENV:', process.env.NODE_ENV || 'undefined');
      console.log('  - CWD:', process.cwd());
      console.log('  - __dirname:', __dirname);
      console.log('═══════════════════════════════════════════════════');
    }

    if (!apiKey) {
      if (nodeEnv !== 'production') {
        console.error('ERROR: Google Drive API key not found in environment variables');
      }
      return secureResponse.error(res, 'Google Drive API key not configured', 500);
    }

    // SSRF Protection: Validate and sanitize folderId
    const folderId = validateAndSanitizeDriveId(rawFolderId, 'folderId');
    if (!folderId) {
      return secureResponse.error(res, 'Invalid folder ID format. Folder ID must contain only letters, numbers, hyphens, and underscores.', 400);
    }

    // Google Drive API v3 endpoint - EXACT format with all required parameters
    // Important: Single quotes around folder ID, proper encoding, and required flags
    // Note: encodeURIComponent is safe here because folderId has already been validated
    const encodedFolderId = encodeURIComponent(folderId);
    // Request id, name, mimeType, thumbnailLink - frontend will use thumbnailLink or fallback
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${encodedFolderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink)&supportsAllDrives=true&includeItemsFromAllDrives=true&orderBy=name`;

    // Log API URL (development only, API key already hidden)
    if (nodeEnv !== 'production') {
      console.log('GOOGLE DRIVE API URL:', apiUrl.replace(apiKey, 'API_KEY_HIDDEN'));
    }

    // Fetch with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Shyara-Portfolio/1.0'
      }
    });
    
    if (!response.ok) {
      // Get raw error response - clone the response first to avoid "body already read" error
      let rawError = '';
      let errorDetails = {};
      
      try {
        // Clone the response to read it safely
        const clonedResponse = response.clone();
        rawError = await clonedResponse.text();
        
        // Error logging - detailed in development, minimal in production
        if (nodeEnv !== 'production') {
          console.error('═══════════════════════════════════════════════════');
          console.error('GOOGLE DRIVE RAW ERROR (Status:', response.status, '):');
          console.error(rawError);
          console.error('═══════════════════════════════════════════════════');
        } else {
          console.error('GOOGLE DRIVE API ERROR:', response.status, response.statusText);
        }
        
        // Try to parse as JSON for better error message
        try {
          errorDetails = JSON.parse(rawError);
        } catch (e) {
          errorDetails = { raw: rawError };
        }
      } catch (readError) {
        if (nodeEnv !== 'production') {
          console.error('Error reading error response:', readError.message);
        }
        errorDetails = { error: 'Could not read error response' };
      }

      // Sanitize error details in production - don't expose internal API error details
      const errorData = nodeEnv !== 'production' 
        ? { status: response.status, statusText: response.statusText, details: errorDetails }
        : { status: response.status };
      
      return secureResponse.error(res, 'Failed to fetch files from Google Drive', response.status, errorData);
    }

    const data = await response.json();
    // Log success (development only)
    if (nodeEnv !== 'production') {
      console.log('Google Drive API Success - Files found:', data.files ? data.files.length : 0);
    }
    
    // Filter only images and videos
    const mediaFiles = (data.files || []).filter(file => 
      file.mimeType && (
        file.mimeType.startsWith('image/') || 
        file.mimeType.startsWith('video/')
      )
    );

    // Log filtering results (development only)
    if (nodeEnv !== 'production') {
      console.log('Media files after filtering:', mediaFiles.length);
    }

    // Transform to our format - return id, name, mimeType, thumbnailLink
    // Frontend will use thumbnailLink or fallback URL: https://lh3.googleusercontent.com/d/<FILE_ID>=s800
    const mapDriveFile = (file) => {
      const { id, name, mimeType, thumbnailLink } = file;

      return {
        id,
        name,
        mimeType,
        thumbnailLink: thumbnailLink || null // null if not available, frontend will use fallback
      };
    };

    const files = mediaFiles.map(mapDriveFile);
    
    // Debug: Log first file structure (development only)
    if (nodeEnv !== 'production' && files.length > 0) {
      console.log('✅ Sample Drive file mapping:', {
        id: files[0].id,
        name: files[0].name,
        proxyUrl: `/api/drive-image/${files[0].id}`,
        mimeType: files[0].mimeType
      });
    }

    // Return JSON response
    return secureResponse.success(res, { files });
  } catch (error) {
    // Error logging - production-safe (hide stack traces in production)
    if (nodeEnv !== 'production') {
      console.error('═══════════════════════════════════════════════════');
      console.error('Error fetching Drive files:', error);
      console.error('Error stack:', error.stack);
      console.error('═══════════════════════════════════════════════════');
    } else {
      // Production: Only log error message, no stack trace
      console.error('Error fetching Drive files:', error.message);
    }
    // Production-safe error response
    return secureResponse.error(res, error, 500);
  }
});

// Serve static files from the build directory (production)
const buildPath = path.join(__dirname, '../frontend/build');
const publicPath = path.join(__dirname, '../frontend/public');

// Check if build directory exists (production), otherwise serve from public (development)
const staticPath = fs.existsSync(buildPath) ? buildPath : publicPath;

// Log static file paths (development only)
if (nodeEnv !== 'production') {
  console.log('Serving static files from:', staticPath);
  console.log('Build path exists:', fs.existsSync(buildPath));
  console.log('Public path exists:', fs.existsSync(publicPath));
}

// Get the index.html path
const indexPath = path.join(staticPath, 'index.html');
// Log index.html path (development only)
if (nodeEnv !== 'production') {
  console.log('Index.html path:', indexPath);
  console.log('Index.html exists:', fs.existsSync(indexPath));
}

const optimizedMediaPath = path.join(staticPath, 'pics-optimized');
if (fs.existsSync(optimizedMediaPath)) {
  app.use('/pics-optimized', express.static(optimizedMediaPath, {
    index: false,
    maxAge: '30d',
    immutable: true,
    setHeaders: (res) => {
      res.set('Cache-Control', 'public, max-age=2592000, immutable');
    }
  }));
}

// Serve static files (JS, CSS, images, etc.)
// But don't automatically serve index.html for directories
app.use(express.static(staticPath, {
  index: false,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Log when serving static files (development only)
    if (nodeEnv !== 'production') {
      console.log('Serving static file:', filePath);
    }
  },
  // Don't fall through to next middleware if file doesn't exist
  // This allows our catch-all route to handle it
  fallthrough: true
}));

// 404 handler for unmatched API routes (must come before SPA fallback)
app.use('/api/*', (req, res) => {
  if (nodeEnv !== 'production') {
    console.error(`❌ API route not found: ${req.method} ${req.path}`);
  }
  return secureResponse.error(res, 'API endpoint not found', 404);
});

// SPA fallback: serve index.html for all GET requests that:
// 1. Are not API routes
// 2. Are not actual static files (those are handled above)
app.get('*', (req, res, next) => {
  // Skip API routes (they should have been handled above)
  if (req.path.startsWith('/api')) {
    return secureResponse.error(res, 'API endpoint not found', 404);
  }
  
  // Skip if it's a static file request (has extension)
  // This prevents serving index.html for actual file requests
  const hasExtension = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map|txt|webmanifest)$/i.test(req.path);
  if (hasExtension) {
    return next();
  }
  
  // Log the request (development only)
  if (nodeEnv !== 'production') {
    console.log('SPA route requested:', req.path);
  }
  
  // Check if index.html exists
  if (!fs.existsSync(indexPath)) {
    if (nodeEnv !== 'production') {
      console.error('index.html not found at:', indexPath);
    }
    return res.status(404).send('index.html not found. Please run: cd frontend && npm run build');
  }
  
  // Read index.html and inject CSP nonce into inline scripts
  fs.readFile(indexPath, 'utf8', (err, html) => {
    if (err) {
      return next(err);
    }
    
    // Get the nonce from res.locals (set by middleware)
    const nonce = res.locals.nonce || '';
    
    // Inject nonce into all <script> tags that don't have a src attribute (inline scripts)
    // This allows inline scripts to execute under CSP nonce policy
    const htmlWithNonce = html
      // Replace inline script tags without nonce
      // Match: <script> or <script ...> where there's no src attribute
      .replace(/<script(?![^>]*\ssrc=)(?![^>]*\snonce=)([^>]*)>/gi, (match, attrs) => {
        // Check if it already has a nonce (shouldn't happen, but defensive)
        if (attrs && attrs.includes('nonce=')) {
          return match;
        }
        // Add nonce attribute - ensure proper spacing
        const spacing = attrs && attrs.trim() ? ' ' : '';
        return `<script${spacing}${attrs} nonce="${nonce}">`;
      });
    
    // Set Content-Type header
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Send the modified HTML
    res.send(htmlWithNonce);
    
    // Only log success in development
    if (nodeEnv !== 'production') {
      console.log('Successfully served index.html with nonce for route:', req.path);
    }
  });
});

// Global error-handling middleware (must be last, after all routes)
// This catches any unhandled errors from routes or middleware
app.use((err, req, res, next) => {
  // Always log the full error on the server side
  if (nodeEnv !== 'production') {
    // Development: Log full error details
    console.error('═══════════════════════════════════════════════════');
    console.error('Unhandled Error:', err);
    console.error('Error Stack:', err.stack);
    console.error('Request Path:', req.path);
    console.error('Request Method:', req.method);
    console.error('═══════════════════════════════════════════════════');
  } else {
    // Production: Log error message only (no stack trace in logs)
    console.error('Unhandled Error:', err.message);
    console.error('Request Path:', req.path);
    console.error('Request Method:', req.method);
  }
  
  // Determine HTTP status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Send response using secure wrapper
  if (nodeEnv !== 'production') {
    // Development: Include error message and stack trace (via secureResponse)
    return secureResponse.error(res, err, statusCode);
  } else {
    // Production: Generic error response, no internal details
    return secureResponse.error(res, 'Something went wrong. Please try again later.', statusCode);
  }
});

app.listen(PORT, () => {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  
  if (isProduction) {
    // Production: Minimal, secure startup logs
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 Server started');
    console.log(`   Port: ${PORT}`);
    console.log(`   Environment: production`);
    
    // Only log critical warnings in production
    if (!apiKey) {
      console.log('   ⚠️  WARNING: GOOGLE_DRIVE_API_KEY is not set!');
    }
    
    console.log('═══════════════════════════════════════════════════');
  } else {
    // Development: Detailed startup logs with helpful information
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 Server starting...');
    console.log(`   Port: ${PORT}`);
    console.log(`   Static files: ${staticPath}`);
    console.log(`   NODE_ENV: ${nodeEnv || 'undefined'}`);
    console.log(`   Environment: DEVELOPMENT`);
    console.log('');
    
    // Check API key (development logging)
    console.log(`   🔑 GOOGLE_DRIVE_API_KEY: ${apiKey ? '✅ LOADED' : '❌ NOT FOUND'}`);
    if (!apiKey) {
      console.log('   ⚠️  WARNING: Google Drive API will not work!');
      console.log('   📝 To fix: Create backend/.env file with:');
      console.log('      GOOGLE_DRIVE_API_KEY=your_api_key_here');
    }
    console.log('');
    
    // Registered API routes (development only)
    console.log('   📍 Registered API Routes:');
    console.log('      - GET  /api/test');
    console.log('      - GET  /api/health');
    console.log('      - GET  /api/drive-list/:folderId');
    console.log('      - GET  /api/drive-image/:fileId');
    console.log('      - POST /api/contact');
    console.log('');
    
    console.log('═══════════════════════════════════════════════════');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Make sure frontend is built: cd frontend && npm run build`);
  }
}); 