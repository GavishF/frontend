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

export function deleteReview(productId, reviewId){
  return client.delete(`/api/products/${productId}/reviews/${reviewId}`);
}

export function addReplyToReview(productId, reviewId, payload){
  return client.post(`/api/products/${productId}/reviews/${reviewId}/reply`, payload);
}
