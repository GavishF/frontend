// Bootstrap script - runs first before anything else

if (typeof window !== 'undefined') {
  try {
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
  }
}

export {};
