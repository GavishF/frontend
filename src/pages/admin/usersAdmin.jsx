import { useEffect, useState } from 'react';
import { getItem } from '../../utils/safeStorage';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UsersAdmin(){
  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);
  const token = getItem('token');

  function load(){
    setLoading(true);
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/users/all', {
      headers:{ Authorization: `Bearer ${token}` }
    }).then(r=> setUsers(r.data))
    .catch(()=> toast.error('Failed to load users'))
    .finally(()=> setLoading(false));
  }

  useEffect(()=>{ load(); },[]);

  function toggleBlock(id){
    axios.post(import.meta.env.VITE_BACKEND_URL + `/api/users/${id}/toggle-block`, {}, {
      headers:{ Authorization: `Bearer ${token}` }
    }).then(()=>{ toast.success('Updated'); load(); })
    .catch(()=> toast.error('Action failed'));
  }
  function toggleRole(id){
    axios.post(import.meta.env.VITE_BACKEND_URL + `/api/users/${id}/toggle-role`, {}, {
      headers:{ Authorization: `Bearer ${token}` }
    }).then(()=>{ toast.success('Role updated'); load(); })
    .catch(()=> toast.error('Action failed'));
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-semibold mb-6'>Users</h1>
      {loading && <p>Loading...</p>}
      {!loading && users.length===0 && <p className='opacity-70'>No users.</p>}
      <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-50 text-black'>
            <tr className='text-left'>
              <th className='px-4 py-3 font-medium'>Name</th>
              <th className='px-4 py-3 font-medium'>Email</th>
              <th className='px-4 py-3 font-medium'>Role</th>
              <th className='px-4 py-3 font-medium'>Blocked</th>
              <th className='px-4 py-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {users.map(u => (
              <tr key={u._id} className='hover:bg-gray-50 transition-colors'>
                <td className='px-4 py-3'>{u.firstName} {u.lastName}</td>
                <td className='px-4 py-3'>{u.email}</td>
                <td className='px-4 py-3'>{u.role}</td>
                <td className='px-4 py-3'>{u.isBlocked ? 'Yes' : 'No'}</td>
                <td className='px-4 py-3 flex flex-wrap gap-2'>
                  <button onClick={()=> toggleBlock(u._id)} className='px-3 py-1 rounded-md text-xs hover:opacity-90' style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}>
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button onClick={()=> toggleRole(u._id)} className='px-3 py-1 rounded-md text-xs bg-gray-100 border border-gray-200' style={{ borderColor: '#e5e7eb' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8C0009'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                    Toggle Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
