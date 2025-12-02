import client from './client';

export function sendOtp(email){
  return client.post('/api/newsletter/send-otp', { email });
}

export function verifyOtp(email, otp){
  return client.post('/api/newsletter/verify', { email, otp });
}

export function listSubscribers(){
  return client.get('/api/newsletter/subscribers');
}

export function createPromo(payload){
  return client.post('/api/newsletter/promos', payload);
}

export function listPromos(){
  return client.get('/api/newsletter/promos');
}

export function sendBroadcast(payload){
  return client.post('/api/newsletter/broadcast', payload);
}
