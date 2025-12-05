// Safe storage wrapper to avoid errors in restricted contexts (iframes, privacy mode, static sites)
// Falls back to in-memory map if localStorage is not accessible.
const memoryStore = new Map();

function canUse(){
  try{
    if(typeof window === 'undefined') return false;
    
    // Don't try to check the property existence since that can throw in some contexts
    let storage;
    try {
      storage = window.localStorage;
      if (!storage) return false;
    } catch(e) {
      // If we can't even access localStorage property, it's not available
      return false;
    }
    
    // Test with a unique key to avoid conflicts
    const testKey = '__stor_test_' + Date.now();
    
    try {
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch(e) {
      // SecurityError, QuotaExceededError, or any DOMException means storage isn't available
      // This is the expected path on Render and restricted contexts
      return false;
    }
  }catch(e){
    // Outermost catch for any unexpected errors
    return false;
  }
}

const enabled = canUse();

export function getItem(key){
  if(!key) return null;
  try {
    if(enabled){
      const val = window.localStorage.getItem(key);
      return val || null;
    }
  } catch(e) {
    // Silently ignore storage errors on restricted contexts
  }
  return memoryStore.get(key) || null;
}

export function setItem(key, val){
  if(!key) return;
  try {
    if(enabled){
      window.localStorage.setItem(key, val);
      return;
    }
  } catch(e) {
    // Silently ignore storage errors on restricted contexts
  }
  memoryStore.set(key, val);
}

export function removeItem(key){
  if(!key) return;
  try {
    if(enabled){
      window.localStorage.removeItem(key);
    }
  } catch(e) {
    // Silently ignore storage errors on restricted contexts
  }
  memoryStore.delete(key);
}

export function isPersistent(){ return enabled; }

export default { getItem, setItem, removeItem, isPersistent };