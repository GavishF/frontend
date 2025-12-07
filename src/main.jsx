import './bootstrap.js'
import { StrictMode, useEffect, useState, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import GlobalLoader from './components/GlobalLoader'
import './utils/storageErrorHandler.js'

// CRITICAL: Suppress ALL storage errors at global level
if (typeof window !== 'undefined') {
  // Suppress unhandled promise rejections from storage errors
  window.addEventListener('unhandledrejection', event => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (msg.includes('storage') || msg.includes('Storage') || msg.includes('Access')) {
      event.preventDefault();
    }
  });

  // Override fetch to suppress storage error responses
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(err => {
      if (err && err.message && (err.message.includes('storage') || err.message.includes('Access'))) {
        console.log('[Storage Error Suppressed]', err.message);
        return Promise.resolve(new Response('', { status: 500 }));
      }
      throw err;
    });
  };

  // Wrap document.addEventListener to suppress storage errors
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'unhandledrejection' || type === 'error') {
      const wrappedListener = function(event) {
        try {
          const msg = event?.reason?.message || event?.message || String(event);
          if (msg.includes('storage') || msg.includes('Storage')) {
            event.preventDefault?.();
            event.stopImmediatePropagation?.();
            return;
          }
        } catch(e) {}
        return listener(event);
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
}

// Suppress storage access errors globally
if (typeof window !== 'undefined') {
  try {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(...args) {
      try { return originalSetItem.apply(this, args); } catch(e) { 
        if(!e.message.includes('storage')) throw e;
      }
    };
    
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function(...args) {
      try { return originalGetItem.apply(this, args); } catch(e) { 
        if(!e.message.includes('storage')) throw e;
        return null;
      }
    };
    
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function(...args) {
      try { return originalRemoveItem.apply(this, args); } catch(e) { 
        if(!e.message.includes('storage')) throw e;
      }
    };
  } catch(e) { /* ignore */ }
}

function ErrorOverlay(){
  const [error, setError] = useState(null);

  useEffect(()=>{
    function onErr(message, source, lineno, colno, err){
      setError({ message: message?.toString() || (err && err.message) || 'Unknown error', source, lineno, colno, stack: err && err.stack });
      return false;
    }
    function onRejection(e){
      setError({ message: e?.reason?.message || 'Unhandled rejection', stack: e?.reason?.stack });
    }
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRejection);
    return ()=>{
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onRejection);
    }
  }, []);

  if(!error) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, background: 'rgba(0,0,0,0.8)', color:'#fff', padding: 20, fontFamily: 'monospace', overflow: 'auto' }}>
      <h2 style={{ margin: 0, marginBottom: 8 }}>Runtime Error</h2>
      <div><strong>Message:</strong> {error.message}</div>
      {error.source && <div><strong>Source:</strong> {error.source}:{error.lineno}:{error.colno}</div>}
      {error.stack && <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{error.stack}</pre>}
      <div style={{ marginTop: 12 }}>
        <button onClick={()=> setError(null)} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Dismiss</button>
      </div>
    </div>
  );
}

// Simple passthrough when using static import
function AppLoader(){ return <App />; }

// Lightweight DOM-level error overlay (attaches before React mounts)
function showDomError(message){
  try{
    let overlay = document.getElementById('dev-error-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'dev-error-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '2147483647';
      overlay.style.background = 'rgba(0,0,0,0.85)';
      overlay.style.color = '#fff';
      overlay.style.padding = '20px';
      overlay.style.fontFamily = 'monospace';
      overlay.style.overflow = 'auto';
      document.body.appendChild(overlay);
    }
    overlay.innerText = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  }catch(e){
    // ignore
    }
}

window.addEventListener('error', (ev)=>{
  // Suppress storage access errors completely
  if(ev && ev.message && (ev.message.includes('storage') || ev.message.includes('Storage'))) {
    ev.preventDefault();
    return;
  }
  try{ showDomError((ev && ev.message) || String(ev)); }catch(e){}
});
window.addEventListener('unhandledrejection', (ev)=>{
  // Suppress storage access errors completely
  if(ev && ev.reason && ev.reason.message && (ev.reason.message.includes('storage') || ev.reason.message.includes('Storage'))) {
    ev.preventDefault();
    return;
  }
  try{ showDomError((ev && ev.reason && ev.reason.message) || JSON.stringify(ev)); }catch(e){}
});

// Error boundary to catch render errors inside React tree
class AppErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(error, info){
    // Mirror to DOM overlay as well
    showDomError((error && (error.message || String(error))) + '\n' + (info && info.componentStack ? info.componentStack : ''));
  }
  render(){
    if(this.state.error){
      return (
        <div style={{ padding: 28, fontFamily: 'monospace', color: '#fff' }}>
          <h2>Application Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error && this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <GlobalLoader />
      <div id="app-root" className="app-root transition-all duration-300">
        <AppErrorBoundary>
          <AppLoader />
        </AppErrorBoundary>
      </div>
      <ErrorOverlay />
    </BrowserRouter>
  </StrictMode>,
)

// Global 3D was intentionally removed — 3D will be applied only where needed (e.g. image slider)
