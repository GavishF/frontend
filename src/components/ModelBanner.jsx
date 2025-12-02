import { useEffect, useState } from 'react';
import client from '../services/client';

export default function ModelBanner(){
  const [model,setModel] = useState(null);
  useEffect(()=>{
    client.get('/api/config').then(r=> setModel(r.data.aiModel)).catch(()=>{});
  },[]);
  if(!model) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,right:0}} className="w-full bg-white/90 text-black text-sm py-1 px-4 flex justify-between backdrop-blur-sm">
      <span>AI Model Enabled: {model}</span>
    </div>
  );
}
