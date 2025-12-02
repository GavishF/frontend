import axios from 'axios';
import { getItem } from '../utils/safeStorage.js';

const fallbackBase = 'http://localhost:5000';
const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || fallbackBase,
});

client.interceptors.request.use((config) => {
  const token = getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
