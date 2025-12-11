import client from './client';

export const createReturn = async (data) => {
  return client.post('/api/returns', data);
};

export const getUserReturns = async (userId) => {
  return client.get(`/api/returns/user/${userId}`);
};

export const getAllReturns = async () => {
  return client.get('/api/returns');
};

export const updateReturnStatus = async (id, data) => {
  return client.put(`/api/returns/${id}`, data);
};
