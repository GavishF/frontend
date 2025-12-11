import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CategoriesAdmin(){
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/categories')
      .then(r => setCategories(r.data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-semibold mb-6'>Available Categories</h1>
      <p className='text-sm text-neutral-600 mb-6'>Categories are predefined. Products can be assigned to one or multiple categories.</p>
      <div className='grid md:grid-cols-3 gap-6'>
        {categories.map(c => (
          <div key={c._id} className='p-5 rounded-xl bg-white border border-gray-200 transition' style={{ borderColor: '#e5e7eb' }}>
            <h2 className='font-semibold text-lg mb-2'>{c.name}</h2>
            <span className='text-[10px] inline-block px-3 py-1 rounded bg-gray-100 border border-gray-200 text-black font-mono'>{c.slug}</span>
          </div>
        ))}
        {!categories.length && <p className='text-sm opacity-70'>No categories available.</p>}
      </div>
    </div>
  );
}
