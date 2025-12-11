import client from './client';

export const getHolidayStatus = async () => {
  // This will be replaced with actual API call when backend endpoint exists
  // For now, returns the stored/default holiday data
  try {
    const stored = localStorage.getItem('holidayMode');
    if (stored) {
      return { data: JSON.parse(stored) };
    }
    return { data: { enabled: true, discount: 25 } };
  } catch (error) {
    return { data: { enabled: true, discount: 25 } };
  }
};

export const setHolidaySettings = async (settings) => {
  try {
    localStorage.setItem('holidayMode', JSON.stringify(settings));
    return { data: settings };
  } catch (error) {
    throw new Error('Failed to update holiday settings');
  }
};
