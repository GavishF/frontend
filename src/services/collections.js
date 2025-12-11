import client from './client';

export const getCollections = async () => {
  return client.get('/api/collections');
};

export const getFeaturedCollections = async () => {
  return client.get('/api/collections/featured');
};

export const createCollection = async (data) => {
  return client.post('/api/collections', data);
};

export const updateCollection = async (id, data) => {
  return client.put(`/api/collections/${id}`, data);
};

export const deleteCollection = async (id) => {
  return client.delete(`/api/collections/${id}`);
};
