// Synthesized sound helper
function playSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ac = new AudioCtx();
    const now = ac.currentTime;
    const gain = ac.createGain();
    gain.connect(ac.destination);

    switch(type) {
      case 'cash':
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.6, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        const o1 = ac.createOscillator(); o1.type='square'; o1.frequency.setValueAtTime(880, now);
        const o2 = ac.createOscillator(); o2.type='triangle'; o2.frequency.setValueAtTime(1320, now+0.02);
        o1.connect(gain); o2.connect(gain);
        o1.start(now); o2.start(now+0.02);
        o1.stop(now+0.42); o2.stop(now+0.42);
        break;
      
      case 'whoosh':
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        const osc = ac.createOscillator(); osc.type='sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.5);
        osc.connect(gain);
        osc.start(now); osc.stop(now+0.65);
        break;
      
      case 'pop':
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        const pop = ac.createOscillator(); pop.type='sine';
        pop.frequency.setValueAtTime(800, now);
        pop.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        pop.connect(gain);
        pop.start(now); pop.stop(now+0.15);
        break;
      
      case 'swoosh':
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        const sw = ac.createOscillator(); sw.type='sawtooth';
        sw.frequency.setValueAtTime(300, now);
        sw.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        sw.connect(gain);
        sw.start(now); sw.stop(now+0.3);
        break;
      
      case 'star':
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        const st = ac.createOscillator(); st.type='triangle';
        st.frequency.setValueAtTime(1200, now);
        st.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        st.connect(gain);
        st.start(now); st.stop(now+0.2);
        break;
      
      case 'twinkle':
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        const tw1 = ac.createOscillator(); tw1.type='sine'; tw1.frequency.setValueAtTime(1400, now);
        const tw2 = ac.createOscillator(); tw2.type='sine'; tw2.frequency.setValueAtTime(1760, now+0.05);
        tw1.connect(gain); tw2.connect(gain);
        tw1.start(now); tw2.start(now+0.05);
        tw1.stop(now+0.4); tw2.stop(now+0.4);
        break;
    }
  } catch(_) {}
}

// 3D Card Pack Opening Animation
export function playCardPackAnimation(element, callback) {
  if (!element) return;
  playSound('whoosh');
  
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true);

  try{
    const cs = window.getComputedStyle(element);
    clone.style.background = cs.background;
    clone.style.border = cs.border;
    clone.style.boxShadow = cs.boxShadow;
    clone.style.borderRadius = cs.borderRadius;
    clone.style.padding = cs.padding;
    clone.style.margin = 0;
  }catch(_){ }
  
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    perspective: 1000px;
    z-index: 9999;
    pointer-events: none;
  `;
  
  clone.style.cssText = `
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: cardPackOpen 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    overflow: hidden;
  `;
  
  container.appendChild(clone);
  document.body.appendChild(container);
  
  const shine = document.createElement('div');
  shine.style.cssText = `
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    animation: shine 0.8s ease-out;
    pointer-events: none;
  `;
  container.appendChild(shine);
  
  setTimeout(() => {
    document.body.removeChild(container);
    if (callback) callback();
  }, 800);
}

// Wishlist Remove Animation
export function playWishlistRemoveAnimation(element, callback) {
  if (!element) return;
  playSound('swoosh');
  
  element.style.animation = 'wishlistRemove 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  
  setTimeout(() => {
    element.style.animation = '';
    if (callback) callback();
  }, 600);
}

// Cart Journey Animation with Product Collection
import { getItem as safeGetItem } from './safeStorage';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function playCartJourneyAnimation(productElement, productData) {
  playSound('pop');
  return new Promise((resolve) => {
    const rect = productElement.getBoundingClientRect();
    
    const cartContainer = document.createElement('div');
    cartContainer.innerHTML = `
      <div class="cart-journey-wrapper">
        <svg class="cart-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <div class="cart-product-preview"></div>
      </div>
    `;
    
    const wrapper = cartContainer.querySelector('.cart-journey-wrapper');
    wrapper.style.cssText = `
      position: fixed;
      left: -150px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10000;
      pointer-events: none;
    `;
    
    const icon = cartContainer.querySelector('.cart-icon');
    icon.style.cssText = `
      width: 120px;
      height: 120px;
      color: #dc2626;
      filter: drop-shadow(0 6px 20px rgba(220, 38, 38, 0.5));
      animation: cartBounce 0.4s ease-in-out infinite;
    `;
    
    document.body.appendChild(cartContainer);

    const stopTrail = startHeartTrail(wrapper);
    
    // Compute a stop point just to the left of the product card
    const stopX = Math.max(20, rect.left - 60);
    const stopY = Math.max(20, rect.top + (rect.height / 2) - 60);
    wrapper.style.top = `${stopY}px`;
    // First leg: from left offscreen to just in front of the product card
    animateCartMovement(wrapper, -150, stopX, 900).then(async () => {
    
      await sleep(300);

      const preview = wrapper.querySelector('.cart-product-preview');
      const productImage = productData?.images?.[0] || '';
      if (productImage) {
        preview.innerHTML = `
          <img src="${productImage}" style="
            position: absolute;
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
            border: 2px solid #dc2626;
            left: 35px;
            top: 25px;
            opacity: 0;
            animation: itemPopIn 0.5s ease-out forwards;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          " alt="" />
        `;
      }

      await sleep(600);
      // Second leg: slide to the right and disappear offscreen
      const offscreenRight = window.innerWidth + 180;
      animateCartMovement(wrapper, stopX, offscreenRight, 900).then(() => {
        // Arrival bounce for polish
        try {
          wrapper.style.transition = 'transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1)';
          wrapper.style.transform = 'scale(1.08) translateY(-6px)';
          setTimeout(() => {
            wrapper.style.transition = 'transform 180ms ease-out';
            wrapper.style.transform = 'scale(1) translateY(0)';
          }, 180);
        } catch(_) {}

        stopTrail();
        document.body.removeChild(cartContainer);
        try{ window.dispatchEvent(new CustomEvent('cart:updated')); }catch(_){ }
        resolve();
      });
    });
  });
}

function animateCartMovement(element, fromX, toX, duration) {
  return new Promise((resolve) => {
    element.style.left = `${fromX}px`;
    element.getBoundingClientRect();
    element.style.transition = `left ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    element.style.left = `${toX}px`;
    setTimeout(resolve, duration);
  });
}

function startHeartTrail(anchor){
  const hearts = new Set();
  const interval = setInterval(()=>{
    const r = anchor.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.textContent = '♥';
    heart.style.cssText = `
      position: fixed; left: ${r.left + 60 + (Math.random()*20-10)}px; top: ${r.top + 60 + (Math.random()*20-10)}px;
      color: #dc2626; font-size: 20px; opacity: 0.95; filter: drop-shadow(0 2px 8px rgba(220,38,38,0.5));
      transition: transform 800ms ease-out, opacity 800ms ease-out;
      z-index: 9998; pointer-events: none;`;
    document.body.appendChild(heart);
    hearts.add(heart);
    requestAnimationFrame(()=>{
      heart.style.transform = `translate(${Math.random()*40-20}px, ${-40 - Math.random()*30}px) rotate(${Math.random()*60-30}deg) scale(1.3)`;
      heart.style.opacity = '0';
    });
    setTimeout(()=>{ heart.remove(); hearts.delete(heart); }, 850);
  }, 70);
  return ()=>{ clearInterval(interval); hearts.forEach(h=>h.remove()); hearts.clear(); };
}

// Payment Celebration Animation
export function playPaymentCelebration(callback) {
  playSound('cash');
  try { if (navigator?.vibrate) navigator.vibrate([30, 20, 30]); } catch(_) {}
  
  return new Promise(async (resolve) => {
    let cart = [];
    try {
      const raw = safeGetItem('cart');
      cart = raw ? JSON.parse(raw) : [];
    } catch (_) { cart = []; }

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed; inset:0; z-index:10000; pointer-events:none; background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%); transition: background 600ms ease;`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);
    setTimeout(()=>{ overlay.style.background = 'transparent'; }, 500);

    const badge = document.createElement('div');
    badge.textContent = 'Payment Successful';
    badge.style.cssText = `
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) scale(0.72);
      background: #0b0b0b; color:#fff; padding:14px 22px; border-radius:999px;
      border:2px solid #dc2626; box-shadow:0 0 0 2px rgba(220,38,38,0.15), 0 14px 36px rgba(220,38,38,0.35);
      font-weight:800; letter-spacing:.35px; font-size:16px; opacity:0;
      transition: transform 280ms cubic-bezier(.2,.8,.2,1), opacity 400ms ease;
      will-change: transform, opacity;
    `;
    overlay.appendChild(badge);
    requestAnimationFrame(() => {
      badge.style.opacity = '1';
      badge.style.transform = 'translate(-50%,-50%) scale(1.06)';
      setTimeout(() => {
        badge.style.transform = 'translate(-50%,-50%) scale(1)';
      }, 180);
      setTimeout(() => {
        badge.style.transition = 'transform 260ms ease, opacity 420ms ease';
        badge.style.opacity = '0';
        badge.style.transform = 'translate(-50%,-50%) scale(0.96)';
      }, 1500);
    });

    const particles = [];
    const confetti = [];
    const gravity = 1500;
    const floorY = window.innerHeight - 28;
    const spawnRupees = 35;
    for (let i = 0; i < spawnRupees; i++) {
      const angle = (-Math.PI/2) + (Math.random()*Math.PI/2 - Math.PI/4);
      const speed = 600 + Math.random()*500;
      particles.push({
        kind: 'rupee',
        x: window.innerWidth/2 + (Math.random()*60-30),
        y: window.innerHeight*0.35,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        w: 36 + Math.random()*20,
        rot: Math.random()*Math.PI*2,
        vr: (Math.random()*4-2),
        life: 2.8 + Math.random()*0.8,
        alpha: 1
      });
    }

    const colors = ['#dc2626', '#ffffff', '#111111', '#e5e7eb'];
    for (let i = 0; i < 20; i++) {
      const a = Math.random()*Math.PI*2;
      const sp = 400 + Math.random()*600;
      confetti.push({
        x: window.innerWidth/2,
        y: window.innerHeight*0.42,
        vx: Math.cos(a)*sp,
        vy: Math.sin(a)*sp - 200,
        w: 6 + Math.random()*6,
        h: 8 + Math.random()*8,
        rot: Math.random()*Math.PI*2,
        vr: (Math.random()*2-1)*8,
        color: colors[Math.floor(Math.random()*colors.length)],
        alpha: 1,
        life: 1.8 + Math.random()*0.8
      });
    }

    const products = (cart || []).slice(-4);
    const sprites = products.map((p) => {
      const img = document.createElement('img');
      img.src = p?.images?.[0] || '';
      const size = 84 + Math.floor(Math.random()*24);
      img.style.cssText = `position:absolute; left:0; top:0; width:${size}px; height:${size}px; border-radius:12px; border:2px solid #e11d48; box-shadow:0 8px 24px rgba(0,0,0,.35); transform:translate(-9999px,-9999px);`;
      overlay.appendChild(img);
      return {
        el: img,
        x: window.innerWidth/2 + (Math.random()*160 - 80),
        y: window.innerHeight*0.3 + (Math.random()*30-15),
        vx: (Math.random()*400 - 200),
        vy: -(600 + Math.random()*300),
        w: size, h: size,
        rot: Math.random()*Math.PI, vr: (Math.random()*2-1)*2,
        resting: false
      };
    });

    let last = performance.now();
    let elapsed = 0;
    const maxDuration = 2400;

    function step(now) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      elapsed += dt*1000;

      ctx.clearRect(0,0,canvas.width/dpr,canvas.height/dpr);

      for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i];
        p.vy += gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;

        if (p.y > floorY) {
          p.y = floorY;
          p.vy *= -0.38;
          p.vx *= 0.82;
          if (Math.abs(p.vy) < 80) { p.vy = 0; p.vx *= 0.7; }
        }
        p.life -= dt;
        if (p.life < 0) p.alpha = Math.max(0, p.alpha - dt*0.7);
        if (p.alpha <= 0.02) { particles.splice(i,1); continue; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#dc2626';
        ctx.font = `900 ${p.w}px system-ui, -apple-system, Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('රු', 0, 0);
        ctx.restore();
      }

      for (let i = confetti.length-1; i >= 0; i--) {
        const c = confetti[i];
        c.vy += gravity * 0.7 * dt;
        c.vx *= 0.995;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot += c.vr * dt;
        c.life -= dt;
        if (c.y > floorY) { c.y = floorY; c.vy *= -0.3; c.vx *= 0.8; c.vr *= 0.8; }
        if (c.life < 0) c.alpha = Math.max(0, c.alpha - dt*1.2);
        if (c.alpha <= 0.02) { confetti.splice(i,1); continue; }
        ctx.save();
        ctx.globalAlpha = c.alpha;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w/2, -c.h/2, c.w, c.h);
        ctx.restore();
      }

      sprites.forEach(s => {
        if (s.resting) return;
        s.vy += gravity * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.vr * dt;
        if (s.y + s.h/2 > floorY) {
          s.y = floorY - s.h/2;
          s.vy *= -0.42;
          s.vx *= 0.86;
          s.vr *= 0.82;
          if (Math.abs(s.vy) < 60) { s.vy = 0; s.vx *= 0.75; s.vr = 0; s.resting = true; }
        }
        s.el.style.transform = `translate(${Math.round(s.x - s.w/2)}px, ${Math.round(s.y - s.h/2)}px) rotate(${s.rot}rad)`;
      });

      if (elapsed < maxDuration || (particles.length + confetti.length) > 0 || sprites.some(s=>!s.resting)) {
        requestAnimationFrame(step);
      } else {
        sprites.forEach(s => s.el.remove());
        overlay.remove();
        if (callback) try{ callback(); }catch(_){ }
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

// Star Smash Animation
export function playStarSmash(container, starCount) {
  playSound('star');
  return new Promise((resolve) => {
    const stars = container.querySelectorAll('button');
    stars.forEach((star, idx) => {
      if (idx < starCount) {
        const span = star.querySelector('span');
        if (span) {
          span.style.animation = `starSmashZoom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${idx * 0.1}s forwards`;
        }
      }
    });
    setTimeout(resolve, starCount * 100 + 600);
  });
}

// Star Rain Effect
export function playStarRain(duration = 2500) {
  playSound('twinkle');
  return new Promise((resolve) => {
    const starCount = 40;
    const stars = [];
    
    for (let i = 0; i < starCount; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.textContent = '⭐';
        const xOffset = Math.random() * window.innerWidth;
        star.style.cssText = `
          position: fixed;
          left: ${xOffset}px;
          top: -50px;
          font-size: ${15 + Math.random() * 15}px;
          z-index: 10001;
          pointer-events: none;
          --x-offset: ${xOffset}px;
          animation: starRain ${1.5 + Math.random() * 0.5}s linear forwards;
        `;
        document.body.appendChild(star);
        stars.push(star);
        setTimeout(() => star.remove(), 2500);
      }, i * (duration / starCount));
    }

    setTimeout(() => {
      stars.forEach(s => s.remove());
      resolve();
    }, duration + 500);
  });
}
