// Safe storage wrapper to avoid errors in restricted contexts (iframes, privacy mode)
// Falls back to in-memory map if localStorage is not accessible.
const memoryStore = new Map();

function canUse(){
  try{
    if(typeof window === 'undefined' || !('localStorage' in window)) return false;
    const testKey = '__stor_test__';
    try {
      window.localStorage.setItem(testKey,'1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch(e) {
      return false;
    }
  }catch(e){
    return false;
  }
}

const enabled = canUse();

export function getItem(key){
  try {
    if(enabled){
      try{
        const val = window.localStorage.getItem(key);
        return val || null;
      }catch(e){ 
        return memoryStore.get(key) || null; 
      }
    }
    return memoryStore.get(key) || null;
  } catch(e) {
    try { return memoryStore.get(key) || null; } catch(_) { return null; }
  }
}
export function setItem(key,val){
  try {
    if(enabled){
      try{ window.localStorage.setItem(key,val); return; }catch(e){ /* fall through */ }
    }
    memoryStore.set(key,val);
  } catch(e) {
    try { memoryStore.set(key,val); } catch(_) { /* ignore */ }
  }
}
export function removeItem(key){
  try {
    if(enabled){
      try{ window.localStorage.removeItem(key); }catch(e){ /* ignore */ }
    }
    memoryStore.delete(key);
  } catch(e) {
    try { memoryStore.delete(key); } catch(_) { /* ignore */ }
  }
}
export function isPersistent(){ return enabled; }

export default { getItem, setItem, removeItem, isPersistent };