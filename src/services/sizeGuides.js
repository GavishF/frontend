import client from './client';

export const getSizeGuides = async () => {
  return client.get('/api/size-guides');
};

export const getSizeGuide = async (category) => {
  return client.get(`/api/size-guides/${category}`);
};

export const createSizeGuide = async (category, data) => {
  return client.post(`/api/size-guides/${category}`, data);
};

export const deleteSizeGuide = async (category) => {
  return client.delete(`/api/size-guides/${category}`);
};
