import client from './client';

export const getAnalytics = async () => {
  return client.get('/api/analytics');
};

export const getAnalyticsByDateRange = async (startDate, endDate) => {
  return client.get(`/api/analytics/range/${startDate}/${endDate}`);
};

export const recordAnalytics = async (data) => {
  return client.post('/api/analytics/record', data);
};
