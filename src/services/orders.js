import client from './client';

export function createOrder(data){
  return client.post('/api/orders', data);
}

export function listOrders(page=1, limit=10){
  return client.get('/api/orders', { params: { page, limit } });
}

export function updateOrder(orderId, data){
  return client.put(`/api/orders/${orderId}`, data);
}
