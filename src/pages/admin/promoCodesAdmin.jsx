import { useState, useEffect } from 'react';
import { getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from '../../services/promoCodes';
import { getItem } from '../../utils/safeStorage';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import axios from 'axios';

export default function PromoCodesAdmin() {
  const [codes, setCodes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    maxUses: '',
    minOrderAmount: 0,
    expiryDate: ''
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const token = getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadCodes();
  }, []);

  function loadCodes() {
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/promo-codes', { headers })
      .then(r => setCodes(r.data))
      .catch(() => toast.error('Failed to load promo codes'));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.code.trim()) return toast.error('Code required');

    const payload = { ...formData };
    if (formData.maxUses === '') delete payload.maxUses;

    const promise = editingId
      ? axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/promo-codes/${editingId}`, payload, { headers })
      : axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/promo-codes`, payload, { headers });

    promise
      .then(() => {
        toast.success(editingId ? 'Promo code updated' : 'Promo code created');
        loadCodes();
        resetForm();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Error saving promo code'));
  }

  function resetForm() {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      maxUses: '',
      minOrderAmount: 0,
      expiryDate: ''
    });
    setEditingId(null);
    setShowForm(false);
  }

  function deleteCode(id) {
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/promo-codes/${id}`, { headers })
      .then(() => {
        toast.success('Promo code deleted');
        loadCodes();
      })
      .catch(() => toast.error('Failed to delete'));
  }

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>Promo Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='px-4 py-2 rounded-md text-white font-semibold'
          style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}
        >
          {showForm ? 'Cancel' : 'Add Code'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg mb-8 border border-gray-200'>
          <div className='grid md:grid-cols-2 gap-4'>
            <input
              type='text'
              placeholder='Promo Code'
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
            <input
              type='text'
              placeholder='Description'
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
            <select
              value={formData.discountType}
              onChange={e => setFormData({ ...formData, discountType: e.target.value })}
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            >
              <option value='percentage'>Percentage</option>
              <option value='fixed'>Fixed Amount</option>
            </select>
            <input
              type='number'
              placeholder='Discount Value'
              value={formData.discountValue}
              onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
            <input
              type='number'
              placeholder='Min Order Amount'
              value={formData.minOrderAmount}
              onChange={e => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
            <input
              type='number'
              placeholder='Max Uses (leave empty for unlimited)'
              value={formData.maxUses}
              onChange={e => setFormData({ ...formData, maxUses: e.target.value })}
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
            <input
              type='date'
              value={formData.expiryDate}
              onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
          </div>
          <button
            type='submit'
            className='mt-4 px-6 py-2 rounded-md text-white font-semibold'
            style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}
          >
            {editingId ? 'Update' : 'Create'} Code
          </button>
        </form>
      )}

      <div className='grid gap-4'>
        {codes.map(code => (
          <div key={code._id} className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className='flex justify-between items-start'>
              <div className='flex-1'>
                <h3 className='font-semibold text-lg'>{code.code}</h3>
                <p className='text-sm text-gray-600'>{code.description}</p>
                <div className='text-xs text-gray-500 mt-2'>
                  <span className='mr-4'>{code.discountType === 'percentage' ? `${code.discountValue}%` : `₹${code.discountValue}`}</span>
                  <span className='mr-4'>Uses: {code.usedCount}/{code.maxUses || '∞'}</span>
                  <span>Min Order: ₹{code.minOrderAmount}</span>
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setEditingId(code._id);
                    setFormData(code);
                    setShowForm(true);
                  }}
                  className='px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600'
                >
                  Edit
                </button>
                <button
                  onClick={() => { setToDelete(code._id); setDeleteModal(true); }}
                  className='px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => { deleteCode(toDelete); setDeleteModal(false); }}
        title='Delete Promo Code'
        message='Are you sure you want to delete this promo code?'
      />
    </div>
  );
}
