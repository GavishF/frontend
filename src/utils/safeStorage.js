// Safe storage wrapper to avoid errors in restricted contexts (iframes, privacy mode, static sites)
// Falls back to in-memory map if localStorage is not accessible.
const memoryStore = new Map();

function canUse(){
  try{
    if(typeof window === 'undefined' || !('localStorage' in window)) return false;
    // Quick check without accessing storage directly
    const testKey = '__stor_test__';
    const testValue = '1';
    
    try {
      // Test only if not in restricted context
      if (!window.localStorage) return false;
      
      // Use Object.getOwnPropertyDescriptor to check if setItem is callable
      // without actually calling it (avoids triggering storage permission checks)
      const descriptor = Object.getOwnPropertyDescriptor(window.localStorage, 'setItem');
      if (!descriptor || typeof descriptor.value !== 'function') return false;
      
      // Safe to call now
      window.localStorage.setItem(testKey, testValue);
      window.localStorage.removeItem(testKey);
      return true;
    } catch(e) {
      // Storage access denied, use memory store
      return false;
    }
  }catch(e){
    // Any error means storage is unavailable
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