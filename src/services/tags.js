import client from './client';

export const getTags = async () => {
  return client.get('/api/tags');
};

export const createTag = async (name) => {
  return client.post('/api/tags', { name });
};

export const deleteTag = async (id) => {
  return client.delete(`/api/tags/${id}`);
};
