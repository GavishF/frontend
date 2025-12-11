import React, { createContext, useState, useEffect } from 'react';
import { getHolidayStatus } from '../services/holiday';

export const HolidayContext = createContext();

export function HolidayProvider({ children }) {
  const [holidayMode, setHolidayMode] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getHolidayStatus();
        setHolidayMode(response.data.enabled);
        // Cap discount at 25% max
        setDiscount(Math.min(response.data.discount, 25));
        localStorage.setItem('holidayMode', JSON.stringify(response.data));
      } catch (error) {
        console.log('Could not fetch Holiday status, checking localStorage');
        const stored = localStorage.getItem('holidayMode');
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setHolidayMode(data.enabled);
            // Cap discount at 25% max
            setDiscount(Math.min(data.discount, 25));
          } catch (e) {
            // Default to holiday mode enabled for development
            setHolidayMode(true);
            setDiscount(25);
          }
        } else {
          // Default to holiday mode enabled for development
          setHolidayMode(true);
          setDiscount(25);
        }
      }
    };

    fetchStatus();

    // Check every 30 seconds for updates
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HolidayContext.Provider value={{ holidayMode, discount }}>
      {children}
    </HolidayContext.Provider>
  );
}

export function useHoliday() {
  const context = React.useContext(HolidayContext);
  if (!context) {
    throw new Error('useHoliday must be used within a HolidayProvider');
  }
  return context;
}
