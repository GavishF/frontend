// Automatically enhance clickable elements with 3D hover if not opted out.
// Elements can opt-out by adding class 'no-3d'. Cards can opt-in by data-clickable attribute.

// Lightweight helper: attach pointer-based tilt to a single element.
export function attachTilt(el, opts = {}){
  if(!el) return () => {};
  if(el.classList && !el.classList.contains('no-3d')) el.classList.add('auto-3d');
  const maxRot = opts.maxRot ?? 12; // degrees
  const translateY = opts.translateY ?? 4; // px
  let raf = null;
  function onMove(e){
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width; // 0..1
    const y = (e.clientY - b.top) / b.height; // 0..1
    const rx = (0.5 - y) * maxRot; // tilt X
    const ry = (x - 0.5) * maxRot; // tilt Y
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      el.style.transform = `translateY(-${translateY}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
  }
  function onLeave(){ if(raf) cancelAnimationFrame(raf); el.style.transform = ''; }
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);
  el.addEventListener('blur', onLeave);
  // return cleanup
  return ()=>{
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    el.removeEventListener('blur', onLeave);
    if(el.classList) el.classList.remove('auto-3d');
    el.style.transform = '';
  };
}

// Keep a default export for backwards compatibility (noop)
export default null;

// --- Global 3D mode ------------------------------------------------------
// Call enableGlobal3D() to apply subtle 3D parallax to most visible elements.
// It sets a per-element `--depth` CSS variable and updates `--mx`/`--my` on
// the document root during pointer movement so the browser can compute
// per-element transforms cheaply in CSS.
export function enableGlobal3D(){
  if(typeof document === 'undefined') return;
  // small set of tags to exclude from heavy transforms
  const exclude = new Set(['SCRIPT','STYLE','META','LINK','SVG','CANVAS','NOSCRIPT','HTML','HEAD','TITLE']);
  const all = Array.from(document.body.querySelectorAll('*'));
  const vw = Math.max(window.innerWidth || 1024, 1024);
  const vh = Math.max(window.innerHeight || 768, 768);
  const area = vw * vh;

  const elements = all.filter(el => {
    if(!el.offsetParent) return false; // not visible
    if(exclude.has(el.tagName)) return false;
    if(el.classList && el.classList.contains('no-3d')) return false;
    // avoid form inputs and heavy controls
    if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return false;
    return true;
  });

  elements.forEach(el => {
    try{
      const r = el.getBoundingClientRect();
      // depth based on element area relative to viewport, clamped
      const elArea = Math.max(1, r.width * r.height);
      let depth = 0.8 + (elArea / area) * 4.0; // roughly 0.8 .. 4.8
      if(depth < 0.6) depth = 0.6;
      if(depth > 3.2) depth = 3.2;
      el.style.setProperty('--depth', depth.toFixed(3));
      el.classList.add('auto-3d');
    }catch(e){ /* ignore elements that throw */ }
  });

  // update root CSS vars on pointer move (cheap: only two vars changed per frame)
  let raf = null;
  function onMove(e){
    const x = (e.clientX / window.innerWidth) - 0.5; // -0.5 .. 0.5
    const y = (e.clientY / window.innerHeight) - 0.5;
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      document.documentElement.style.setProperty('--mx', (x).toFixed(4));
      document.documentElement.style.setProperty('--my', (y).toFixed(4));
    });
  }
  function onLeave(){
    if(raf) cancelAnimationFrame(raf);
    document.documentElement.style.setProperty('--mx', '0');
    document.documentElement.style.setProperty('--my', '0');
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave, { passive: true });
  window.addEventListener('blur', onLeave);
}

// By default do NOT enable global mode automatically. Consumer can import
// and call `enableGlobal3D()` when they want to apply the effect.