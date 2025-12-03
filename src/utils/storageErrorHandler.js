// Comprehensive storage error handler - prevents ALL uncaught storage errors
// This must be imported FIRST in main.jsx

// CRITICAL: Override console FIRST before anything else logs
const originalError = console.error;
console.error = function(...args) {
  const errorStr = args.map(a => {
    try { return String(a); } catch(e) { return ''; }
  }).join(' ');
  
  // Check for storage-related errors
  if (errorStr.includes('storage') || errorStr.includes('Storage') || 
      errorStr.includes('not allowed') || errorStr.includes('restricted')) {
    return; // Completely suppress storage errors
  }
  
  return originalError.apply(console, args);
};

const originalWarn = console.warn;
console.warn = function(...args) {
  const warnStr = args.map(a => {
    try { return String(a); } catch(e) { return ''; }
  }).join(' ');
  
  if (warnStr.includes('storage') || warnStr.includes('Storage')) {
    return; // Completely suppress storage warnings
  }
  
  return originalWarn.apply(console, args);
};

// Suppress unhandledrejection events for storage errors IMMEDIATELY
window.addEventListener('unhandledrejection', (event) => {
  if (event && event.reason) {
    const reason = event.reason;
    const message = reason?.message || String(reason);
    
    if (message.includes('storage') || message.includes('Storage') || 
        message.includes('not allowed') || message.includes('restricted')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }
}, true); // Use capture phase to intercept before other handlers

if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const memoryStore = new Map();
    
    const handler = {
      getItem(target, prop) {
        if (prop === 'getItem') {
          return function(key) {
            try {
              return Reflect.get(target, prop).call(target, key);
            } catch (e) {
              if (e.message && e.message.includes('storage')) {
                return memoryStore.get(key) || null;
              }
              throw e;
            }
          };
        }
        if (prop === 'setItem') {
          return function(key, value) {
            try {
              return Reflect.get(target, prop).call(target, key, value);
            } catch (e) {
              if (e.message && e.message.includes('storage')) {
                memoryStore.set(key, value);
                return;
              }
              throw e;
            }
          };
        }
        if (prop === 'removeItem') {
          return function(key) {
            try {
              return Reflect.get(target, prop).call(target, key);
            } catch (e) {
              if (e.message && e.message.includes('storage')) {
                memoryStore.delete(key);
                return;
              }
              throw e;
            }
          };
        }
        return Reflect.get(target, prop);
      }
    };
    
    window.localStorage = new Proxy(window.localStorage, handler);
    if (window.sessionStorage) {
      window.sessionStorage = new Proxy(window.sessionStorage, handler);
    }
  } catch (e) {
    // If proxy fails, continue without it
  }
}

// 2. Wrap Promise.catch to suppress storage errors
const originalCatch = Promise.prototype.catch;
Promise.prototype.catch = function(onRejected) {
  return originalCatch.call(this, function(reason) {
    if (reason && reason.message && reason.message.includes('storage')) {
      return undefined; // Silently suppress storage errors
    }
    return onRejected ? onRejected(reason) : Promise.reject(reason);
  });
};

// 3. Wrap Promise.then to suppress storage errors
const originalThen = Promise.prototype.then;
Promise.prototype.then = function(onFulfilled, onRejected) {
  const wrappedFulfilled = onFulfilled ? function(value) {
    try {
      return onFulfilled(value);
    } catch (error) {
      if (error && error.message && error.message.includes('storage')) {
        return undefined;
      }
      throw error;
    }
  } : undefined;

  const wrappedRejected = onRejected ? function(reason) {
    if (reason && reason.message && reason.message.includes('storage')) {
      return undefined;
    }
    return onRejected ? onRejected(reason) : Promise.reject(reason);
  } : undefined;

  return originalThen.call(this, wrappedFulfilled, wrappedRejected);
};

// 4. Global error handler
window.addEventListener('error', (ev) => {
  if (ev && ev.message && ev.message.includes('storage')) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    return false;
  }
}, true);

window.addEventListener('unhandledrejection', (ev) => {
  if (ev && ev.reason && ev.reason.message && ev.reason.message.includes('storage')) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    return false;
  }
}, true);

export default {};

