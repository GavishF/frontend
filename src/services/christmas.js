import client from './client';

export function getChristmasStatus() {
  return client.get('/api/christmas/status');
}

export function toggleChristmasMode(data) {
  return client.post('/api/christmas/toggle', data);
}

export function updateChristmasDiscount(discount) {
  return client.put('/api/christmas/discount', { discount });
}
