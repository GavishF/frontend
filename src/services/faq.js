import client from './client';

export const getFAQs = async () => {
  return client.get('/api/faq');
};

export const getFAQsByCategory = async (category) => {
  return client.get(`/api/faq/category/${category}`);
};

export const createFAQ = async (data) => {
  return client.post('/api/faq', data);
};

export const updateFAQ = async (id, data) => {
  return client.put(`/api/faq/${id}`, data);
};

export const deleteFAQ = async (id) => {
  return client.delete(`/api/faq/${id}`);
};

export const incrementFAQViews = async (id) => {
  return client.post(`/api/faq/${id}/view`);
};
