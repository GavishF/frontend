import React, { useEffect, useState } from 'react';
import { getItem } from '../utils/safeStorage.js';

export default function FreeShippingBar(){
  const [total, setTotal] = useState(0);
  const target = 100; // free shipping threshold
  
  useEffect(()=>{
    setTotal(Number(getItem('cartTotal') || 0));
  }, []);
  
  useEffect(()=>{
    function onUpdate(){ setTotal(Number(getItem('cartTotal') || 0)); }
    if(typeof window !== 'undefined'){
      window.addEventListener('cart:updated', onUpdate);
      const id = setInterval(onUpdate, 1500);
      return ()=>{ window.removeEventListener('cart:updated', onUpdate); clearInterval(id); };
    }
  },[]);

  const pct = Math.min(100, Math.round((total / target) * 100));
  return (
    <div className="w-full bg-white border-t border-gray-200 py-3">
      <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="text-sm text-neutral-400">Progress to free shipping</div>
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mt-1">
            <div className="h-2 bg-red-600" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="text-sm text-neutral-300">රු {total.toFixed(2)} / {target}</div>
      </div>
    </div>
  );
}
