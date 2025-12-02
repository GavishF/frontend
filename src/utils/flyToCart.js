// Animate an image flying to the header cart. Caller should provide an image element or src and a start rect.
export function flyImageToCart(imgElOrSrc){
  try{
    const target = document.querySelector('[data-header-cart]');
    if(!target) return Promise.resolve();
    const startRect = (imgElOrSrc instanceof Element) ? imgElOrSrc.getBoundingClientRect() : null;
    const src = (imgElOrSrc instanceof Element) ? (imgElOrSrc.src || imgElOrSrc.getAttribute('src')) : imgElOrSrc;

    const fly = document.createElement('img');
    fly.src = src || '';
    fly.style.position = 'fixed';
    fly.style.left = (startRect ? startRect.left : window.innerWidth/2 - 40) + 'px';
    fly.style.top = (startRect ? startRect.top : window.innerHeight/2 - 40) + 'px';
    fly.style.width = (startRect ? startRect.width : 80) + 'px';
    fly.style.height = (startRect ? startRect.height : 80) + 'px';
    fly.style.borderRadius = '8px';
    fly.style.zIndex = 9999;
    fly.style.pointerEvents = 'none';
    fly.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1), opacity 700ms ease';
    document.body.appendChild(fly);

    const targetRect = target.getBoundingClientRect();
    const dx = targetRect.left + (targetRect.width/2) - (startRect ? (startRect.left + startRect.width/2) : (window.innerWidth/2));
    const dy = targetRect.top + (targetRect.height/2) - (startRect ? (startRect.top + startRect.height/2) : (window.innerHeight/2));
    // scale down as it moves
    requestAnimationFrame(()=>{
      fly.style.transform = `translate(${dx}px, ${dy}px) scale(0.22) rotate(-10deg)`;
      fly.style.opacity = '0.9';
    });
    return new Promise(resolve => {
      setTimeout(()=>{
        try{ document.body.removeChild(fly); }catch(e){}
        resolve();
      }, 780);
    });
  }catch(e){ return Promise.resolve(); }
}

export default flyImageToCart;
