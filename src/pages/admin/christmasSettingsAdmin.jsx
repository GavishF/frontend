import React, { useEffect, useState } from 'react';
import { FaRegSnowflake } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getChristmasStatus, toggleChristmasMode, updateChristmasDiscount } from '../../services/christmas';

export default function ChristmasSettingsAdmin() {
  const [christmasData, setChristmasData] = useState({
    enabled: false,
    discount: 25,
    snowflakesEnabled: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChristmasStatus();
  }, []);

  const fetchChristmasStatus = async () => {
    try {
      const response = await getChristmasStatus();
      setChristmasData(response.data);
    } catch (error) {
      console.error('Error fetching Christmas status:', error);
      toast.error('Failed to load Christmas settings');
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await toggleChristmasMode({
        enabled: !christmasData.enabled,
        snowflakesEnabled: christmasData.snowflakesEnabled,
        discount: christmasData.discount
      });
      setChristmasData(response.data.mode);
      toast.success(
        response.data.mode.enabled 
          ? '🎄 Christmas mode enabled!' 
          : 'Christmas mode disabled'
      );
    } catch (error) {
      console.error('Error toggling Christmas mode:', error);
      toast.error('Failed to update Christmas mode');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscountChange = async (e) => {
    const newDiscount = parseInt(e.target.value);
    setChristmasData(prev => ({ ...prev, discount: newDiscount }));

    try {
      const response = await updateChristmasDiscount(newDiscount);
      toast.success(`Discount updated to ${newDiscount}%`);
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount');
    }
  };

  const handleSnowflakesToggle = async () => {
    try {
      const newSnowflakesState = !christmasData.snowflakesEnabled;
      const response = await toggleChristmasMode({
        enabled: christmasData.enabled,
        snowflakesEnabled: newSnowflakesState,
        discount: christmasData.discount
      });
      setChristmasData(response.data.mode);
      toast.success(
        newSnowflakesState 
          ? 'Snowflakes enabled!' 
          : 'Snowflakes disabled'
      );
    } catch (error) {
      console.error('Error toggling snowflakes:', error);
      toast.error('Failed to update snowflakes setting');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FaRegSnowflake className="text-blue-400" size={28} />
        Christmas Mode Settings
      </h2>

      <div className="space-y-6">
        {/* Main Toggle */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Enable Christmas Mode</h3>
              <p className="text-gray-600">Activate festive mode with snowflakes and discount</p>
            </div>
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`px-8 py-2 rounded-lg font-semibold transition-all ${
                christmasData.enabled
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-white'
              }`}
            >
              {christmasData.enabled ? '✓ ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Discount Setting */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Christmas Discount</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={christmasData.discount}
              onChange={handleDiscountChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {christmasData.discount}%
              </div>
              <p className="text-sm text-gray-600">OFF</p>
            </div>
          </div>
        </div>

        {/* Snowflakes Toggle */}
        <div className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Falling Snowflakes</h3>
              <p className="text-gray-600">Show snowflake animation on website</p>
            </div>
            <button
              onClick={handleSnowflakesToggle}
              className={`px-8 py-2 rounded-lg font-semibold transition-all ${
                christmasData.snowflakesEnabled
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-white'
              }`}
            >
              {christmasData.snowflakesEnabled ? '❄️ ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Status Display */}
        {christmasData.enabled && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <FaRegSnowflake className="text-red-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-red-800">Christmas Mode Active</h4>
                <p className="text-red-700 text-sm">
                  ✓ {christmasData.discount}% discount applied to all products
                  <br />
                  {christmasData.snowflakesEnabled ? '✓ Snowflakes visible' : '✗ Snowflakes hidden'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
