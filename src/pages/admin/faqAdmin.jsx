import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FAQAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    displayOrder: 0
  });

  const categories = ['shipping', 'returns', 'payment', 'products', 'account', 'general'];

  useEffect(() => {
    loadFAQs();
  }, []);

  function loadFAQs() {
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/faq')
      .then(r => setFaqs(r.data))
      .catch(() => toast.error('Failed to load FAQs'));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      return toast.error('Question and answer required');
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const promise = editingId
      ? axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/faq/${editingId}`, formData, { headers })
      : axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/faq`, formData, { headers });

    promise
      .then(() => {
        toast.success(editingId ? 'FAQ updated' : 'FAQ created');
        loadFAQs();
        resetForm();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Error saving FAQ'));
  }

  function deleteFAQ(id) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/faq/${id}`, { headers })
      .then(() => {
        toast.success('FAQ deleted');
        loadFAQs();
      })
      .catch(() => toast.error('Failed to delete'));
  }

  function resetForm() {
    setFormData({ question: '', answer: '', category: 'general', displayOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>FAQ Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='px-4 py-2 rounded-md text-white font-semibold'
          style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}
        >
          {showForm ? 'Cancel' : 'Add FAQ'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg mb-8 border border-gray-200'>
          <div className='grid gap-4'>
            <textarea
              placeholder='Question'
              value={formData.question}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
              rows='3'
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
            <textarea
              placeholder='Answer'
              value={formData.answer}
              onChange={e => setFormData({ ...formData, answer: e.target.value })}
              rows='5'
              className='px-4 py-2 rounded-md border-2 outline-none'
              style={{ borderColor: '#8C0009' }}
            />
            <div className='grid md:grid-cols-2 gap-4'>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className='px-4 py-2 rounded-md border-2 outline-none'
                style={{ borderColor: '#8C0009' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <input
                type='number'
                placeholder='Display Order'
                value={formData.displayOrder}
                onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className='px-4 py-2 rounded-md border-2 outline-none'
                style={{ borderColor: '#8C0009' }}
              />
            </div>
          </div>
          <button
            type='submit'
            className='mt-4 px-6 py-2 rounded-md text-white font-semibold'
            style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}
          >
            {editingId ? 'Update' : 'Create'} FAQ
          </button>
        </form>
      )}

      <div className='grid gap-4'>
        {faqs.map(faq => (
          <div key={faq._id} className='bg-white p-4 rounded-lg border border-gray-200'>
            <div className='flex justify-between items-start'>
              <div className='flex-1'>
                <h3 className='font-semibold'>{faq.question}</h3>
                <p className='text-sm text-gray-600 mt-2'>{faq.answer}</p>
                <div className='text-xs text-gray-500 mt-2'>
                  <span className='mr-4'>Category: {faq.category}</span>
                  <span>Views: {faq.views}</span>
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setFormData(faq);
                    setEditingId(faq._id);
                    setShowForm(true);
                  }}
                  className='px-3 py-1 text-sm rounded-md bg-blue-500 text-white'
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFAQ(faq._id)}
                  className='px-3 py-1 text-sm rounded-md bg-red-500 text-white'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
