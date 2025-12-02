import toast from 'react-hot-toast';
import client from '../services/client';
import { getItem } from './safeStorage.js';

// Sri Lankan-style sample names (mix of Sinhala & Tamil + common modern names)
const sriNames = [
  'Chamari', 'Kumar', 'Nirosha', 'Sandun', 'Dilani', 'Kasun', 'Priyanka', 'Lakshan', 'Sanjaya', 'Nadeesha',
  'Tharindu', 'Isuri', 'Manoj', 'Anuja', 'Sachira', 'Heshan', 'Ruwan', 'Nipun', 'Priyantha', 'Yasodha'
];

const sriCities = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Matara', 'Anuradhapura', 'Trincomalee', 'Batticaloa'];

async function fetchCartItems(){
  // Prefer server-side cart when logged in
  try{
    const token = getItem('token');
    if(token){
      const resp = await client.get('/api/cart');
      if(resp && resp.data && Array.isArray(resp.data.items) && resp.data.items.length) return resp.data.items;
    }
  }catch(e){ /* ignore */ }
  // fallback to localStorage cart
  try{
    const raw = getItem('cart');
    if(raw){
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed) && parsed.length) return parsed;
    }
  }catch(e){}
  return [];
}

export function startSocialProof(interval = 12000){
  let mounted = true;
  let timerId = null;

  async function show(){
    if(!mounted) return;
    const items = await fetchCartItems();
    const name = sriNames[Math.floor(Math.random()*sriNames.length)];
    const city = sriCities[Math.floor(Math.random()*sriCities.length)];

    let productName = 'a product';
    if(items && items.length){
      const p = items[Math.floor(Math.random()*items.length)];
      productName = p.name || p.productId || productName;
    }

    toast(`${name} in ${city} just added ${productName} to their cart`, { duration: 4500, position: 'bottom-left', style: { background: '#0b0b0b', color: '#fff' } });
  }

  // start immediately
  show().catch(()=>{});
  timerId = setInterval(()=> show().catch(()=>{}), interval);

  return ()=>{ mounted = false; if(timerId) clearInterval(timerId); };
}

export default startSocialProof;
