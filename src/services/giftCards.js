import client from './client';

export const createGiftCard = async (data) => {
  return client.post('/api/gift-cards', data);
};

export const redeemGiftCard = async (code) => {
  return client.post(`/api/gift-cards/redeem/${code}`);
};

export const checkGiftCardBalance = async (code) => {
  return client.get(`/api/gift-cards/balance/${code}`);
};
