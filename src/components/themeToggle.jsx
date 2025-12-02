import { useEffect } from 'react';
import { setItem } from '../utils/safeStorage.js';

export default function ThemeToggle(){
  useEffect(()=>{
    if(typeof document !== 'undefined'){
      const root = document.documentElement;
      // Force light mode site-wide and clear any persisted dark preference
      root.classList.remove('dark');
      setItem('theme','light');
    }
  },[]);

  // Render nothing — theme switching disabled (light-only site)
  return null;
}