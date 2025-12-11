import client from './client';

export const getPromoCodes = async () => {
  return client.get('/api/promo-codes');
};

export const validatePromoCode = async (code, orderAmount) => {
  return client.post('/api/promo-codes/validate', { code, orderAmount });
};

export const createPromoCode = async (data) => {
  return client.post('/api/promo-codes', data);
};

export const updatePromoCode = async (id, data) => {
  return client.put(`/api/promo-codes/${id}`, data);
};

export const deletePromoCode = async (id) => {
  return client.delete(`/api/promo-codes/${id}`);
};
