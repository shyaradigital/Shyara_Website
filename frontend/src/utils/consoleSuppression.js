/**
 * Console Suppression Utility
 * Filters out noisy console messages (WebGL errors, tracking prevention, etc.)
 * Must be loaded early to suppress messages before React initialization
 */

(function() {
  // Suppress patterns for console messages
  const suppress = [
    'WebGL', 
    'GL_INVALID', 
    'Framebuffer', 
    'Tracking Prevention', 
    'updating from', 
    'spline', 
    'blocked access',
    'glTexStorage',
    'glClear',
    'glDraw',
    'glDrawArrays',
    'glDrawElements',
    'glClearBufferfv',
    'Attachment has zero size',
    'too many errors',
    'emailjs',
    'cdn.jsdelivr.net',
    'React DevTools'
  ];
  
  // Check all arguments, not just the first one
  const check = (args) => {
    const combined = args.map(a => String(a || '')).join(' ');
    return suppress.some(s => combined.includes(s));
  };
  
  // Store original console methods
  const _e = console.error.bind(console);
  const _w = console.warn.bind(console);
  const _l = console.log.bind(console);
  const _i = console.info.bind(console);
  
  // Override console methods to filter messages
  console.error = function(...a) { 
    if (!check(a)) _e.apply(console, a); 
  };
  
  console.warn = function(...a) { 
    if (!check(a)) _w.apply(console, a); 
  };
  
  console.log = function(...a) { 
    if (!check(a)) _l.apply(console, a); 
  };
  
  console.info = function(...a) { 
    if (!check(a)) _i.apply(console, a); 
  };
  
  // Show clean startup message in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      _l('%c🎨 Shyara Portfolio', 'color: #a259f7; font-weight: bold; font-size: 16px; padding: 4px 0;');
      _l('%c✓ Console filters active', 'color: #4ade80; font-size: 12px;');
    }, 200);
  }
})();

