import { getItem } from './safeStorage.js';

export function parseJwt(token){
  if(!token) return null;
  try{
    const parts = token.split('.');
    if(parts.length !== 3) return null;
    const payload = parts[1];
    const json = decodeURIComponent(atob(payload).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  }catch(e){
    return null;
  }
}

export function isAdminToken(){
  const token = getItem('token');
  if(!token) return false;
  const payload = parseJwt(token);
  return payload && payload.role === 'admin';
}

export function getUserFromToken(){
  const token = getItem('token');
  if(!token) return null;
  return parseJwt(token);
}
