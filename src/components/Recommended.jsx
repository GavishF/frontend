import React, { useEffect, useState } from 'react';
import { getItem } from '../utils/safeStorage.js';

// Simple local recommendations: use recentlyViewed from localStorage or fall back to popular
export default function Recommended({ max = 4 }){
  const [items, setItems] = useState([]);

  useEffect(()=>{
    try{
      const raw = getItem('recentlyViewed');
      if(raw){
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed) && parsed.length) return setItems(parsed.slice(0,max));
      }
    }catch(e){}
    // fallback popular hardcoded
    const popular = [
      { id: 'p-1', title: 'Essential Tee', price: 24.99, img: '/assets/placeholder1.jpg' },
      { id: 'p-2', title: 'Comfy Hoodie', price: 54.99, img: '/assets/placeholder2.jpg' },
      { id: 'p-3', title: 'Classic Jeans', price: 69.99, img: '/assets/placeholder3.jpg' },
      { id: 'p-4', title: 'Sneaker Lite', price: 89.99, img: '/assets/placeholder4.jpg' },
    ];
    setItems(popular.slice(0, max));
  }, [max]);

  if(!items || !items.length) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h3 className="text-lg font-semibold mb-3">Recommended for you</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(it=> (
          <div key={it.id || it.title} className="p-3 bg-white rounded shadow-sm hover:shadow-md">
            <div className="w-full h-36 bg-gray-100 mb-2 flex items-center justify-center">
              <img src={it.img} alt={it.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
            <div className="text-sm font-medium">{it.title}</div>
            <div className="text-sm text-gray-600">${(it.price || 0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
