// Bootstrap script - runs FIRST before anything else
// MUST be imported first in main.jsx
// This provides additional protection on top of HTML-level suppression

if (typeof window !== 'undefined') {
  // Storage error suppression is already handled in index.html
  // This just provides a fallback in case the HTML script didn't work
  
  try {
    // Don't modify Storage again if already patched
    if (!window.__storagePatched) {
      const memoryStore = new Map();
      
      const origGet = Storage.prototype.getItem;
      Storage.prototype.getItem = function(key) {
        try {
          return origGet.call(this, key);
        } catch (err) {
          return memoryStore.get(key) || null;
        }
      };
      
      const origSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        try {
          return origSet.call(this, key, value);
        } catch (err) {
          memoryStore.set(key, value);
        }
      };
      
      const origRm = Storage.prototype.removeItem;
      Storage.prototype.removeItem = function(key) {
        try {
          return origRm.call(this, key);
        } catch (err) {
          memoryStore.delete(key);
        }
      };
      
      window.__storagePatched = true;
    }
  } catch (e) {
    // Silently fail
  }
}

export {};
