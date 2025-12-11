import { useState, useEffect } from 'react';
import axios from 'axios';
import { getItem } from '../../utils/safeStorage';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';

export default function AnalyticsAdmin() {
  const [analytics, setAnalytics] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const token = getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadAnalytics();
  }, []);

  function loadAnalytics() {
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/analytics', { headers })
      .then(r => setAnalytics(r.data))
      .catch(() => toast.error('Failed to load analytics'));
  }

  function loadByDateRange() {
    if (!dateRange.start || !dateRange.end) return toast.error('Select date range');
    
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/range/${dateRange.start}/${dateRange.end}`, { headers })
      .then(r => setAnalytics(r.data))
      .catch(() => toast.error('Failed to load analytics'));
  }

  const totalSales = analytics.reduce((sum, a) => sum + (a.totalSales || 0), 0);
  const totalOrders = analytics.reduce((sum, a) => sum + (a.totalOrders || 0), 0);
  const avgOrderValue = analytics.length > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-semibold mb-6'>Sales Analytics</h1>

      <div className='bg-white p-6 rounded-lg border border-gray-200 mb-8'>
        <h2 className='font-semibold mb-4'>Date Range Filter</h2>
        <div className='flex gap-4'>
          <input
            type='date'
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            className='px-4 py-2 rounded-md border-2 outline-none'
            style={{ borderColor: '#8C0009' }}
          />
          <input
            type='date'
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            className='px-4 py-2 rounded-md border-2 outline-none'
            style={{ borderColor: '#8C0009' }}
          />
          <button
            onClick={loadByDateRange}
            className='px-6 py-2 rounded-md text-white font-semibold'
            style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}
          >
            Filter
          </button>
        </div>
      </div>

      <div className='grid md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-6 rounded-lg border border-gray-200'>
          <div className='text-sm text-gray-600'>Total Sales</div>
          <div className='text-3xl font-bold'>₹{totalSales.toLocaleString()}</div>
        </div>
        <div className='bg-white p-6 rounded-lg border border-gray-200'>
          <div className='text-sm text-gray-600'>Total Orders</div>
          <div className='text-3xl font-bold'>{totalOrders}</div>
        </div>
        <div className='bg-white p-6 rounded-lg border border-gray-200'>
          <div className='text-sm text-gray-600'>Avg Order Value</div>
          <div className='text-3xl font-bold'>₹{avgOrderValue}</div>
        </div>
        <div className='bg-white p-6 rounded-lg border border-gray-200'>
          <div className='text-sm text-gray-600'>Total Customers</div>
          <div className='text-3xl font-bold'>{analytics.reduce((sum, a) => sum + (a.uniqueCustomers || 0), 0)}</div>
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg border border-gray-200'>
        <h2 className='font-semibold mb-4'>Daily Breakdown</h2>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2'>Date</th>
                <th className='text-right py-2'>Sales</th>
                <th className='text-right py-2'>Orders</th>
                <th className='text-right py-2'>Customers</th>
                <th className='text-right py-2'>Avg Order</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map(a => (
                <tr key={a._id} className='border-b hover:bg-gray-50'>
                  <td className='py-2'>{new Date(a.date).toLocaleDateString()}</td>
                  <td className='text-right'>₹{a.totalSales}</td>
                  <td className='text-right'>{a.totalOrders}</td>
                  <td className='text-right'>{a.uniqueCustomers}</td>
                  <td className='text-right'>₹{(a.totalSales / a.totalOrders).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
