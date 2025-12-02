import client from './client';

export function login(email, password){
  return client.post('/api/users/login', { email, password });
}

export function googleLogin(token){
  return client.post('/api/users/google-login', { token });
}

export function fetchCurrentUser(){
  return client.get('/api/users');
}
