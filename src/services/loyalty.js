import client from './client';

export const getUserLoyalty = async (userId) => {
  return client.get(`/api/loyalty/user/${userId}`);
};

export const addLoyaltyPoints = async (userId, points, orderId) => {
  return client.post(`/api/loyalty/add/${userId}`, { points, orderId });
};

export const redeemLoyaltyPoints = async (userId, points) => {
  return client.post(`/api/loyalty/redeem/${userId}`, { points });
};
