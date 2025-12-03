import client from './client';

export function listProducts(){
  return client.get('/api/products');
}

export function getProduct(productId){
  return client.get(`/api/products/${productId}`);
}

export function searchProducts(query){
  return client.get(`/api/products/search/${encodeURIComponent(query)}`);
}

export function listReviews(productId, params = {}){
  const qs = new URLSearchParams(params).toString();
  return client.get(`/api/products/${productId}/reviews${qs ? '?'+qs : ''}`);
}

export function addReview(productId, payload){
  return client.post(`/api/products/${productId}/reviews`, payload);
}

export function deleteReview(productId, reviewId, email){
  return client.delete(`/api/products/${productId}/reviews/${reviewId}`, { data: { email } });
}

export function editReview(productId, reviewId, payload){
  return client.put(`/api/products/${productId}/reviews/${reviewId}`, payload);
}

export function addReplyToReview(productId, reviewId, payload){
  return client.post(`/api/products/${productId}/reviews/${reviewId}/reply`, payload);
}
