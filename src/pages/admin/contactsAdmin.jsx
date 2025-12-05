import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getItem } from '../../utils/safeStorage.js';

export default function ContactsAdmin(){
  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [selected,setSelected] = useState(null);
  const [reply,setReply] = useState('');
  const token = getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  function load(){
    setLoading(true);
    axios.get(import.meta.env.VITE_BACKEND_URL + '/api/tickets', { headers })
      .then(r=> setItems(r.data))
      .catch(()=> toast.error('Failed to load contacts'))
      .finally(()=> setLoading(false));
  }

  useEffect(()=>{ load(); },[]);

  function sendReply(){
    if(!reply.trim()) return toast.error('Reply required');
    axios.put(import.meta.env.VITE_BACKEND_URL + `/api/tickets/${selected._id}/reply`, { message: reply }, { headers })
      .then(r=>{ toast.success('Reply sent'); setSelected(r.data); setReply(''); load(); })
      .catch(err=> toast.error(err?.response?.data?.message || 'Failed'));
  }
  function closeTicket(){
    axios.put(import.meta.env.VITE_BACKEND_URL + `/api/tickets/${selected._id}/status`, { status: 'closed' }, { headers })
      .then(r=>{ toast.success('Ticket closed'); setSelected(r.data); load(); })
      .catch(()=> toast.error('Close failed'));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && <p className="opacity-70">No messages yet.</p>}
      <div className="grid gap-4">
        {items.map(item => (
          <button key={item._id} onClick={()=> setSelected(item)} className="text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-red-600 transition shadow-sm">
            <div className="flex justify-between flex-wrap gap-2 items-baseline">
              <span className="font-medium truncate max-w-[240px]">{item.subject}</span>
              <span className="text-xs opacity-60">{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm mt-1 line-clamp-2">{item.message}</p>
            <p className="text-xs mt-2 opacity-70">{item.name} • {item.email}</p>
            {item.status === 'closed' && <span className='mt-2 inline-block text-[10px] px-2 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700'>Closed</span>}
          </button>
        ))}
      </div>

      {selected && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='w-full max-w-xl bg-white border border-gray-200 rounded-xl p-6 relative shadow-xl'>
            <button onClick={()=> setSelected(null)} className='absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-black'>Close</button>
            <h2 className='text-xl font-semibold mb-2 text-black'>{selected.subject}</h2>
            <p className='text-sm mb-3 text-gray-600'>From {selected.name} &lt;{selected.email}&gt;</p>
            <div className='mb-4 p-3 rounded-md bg-gray-50 border border-gray-200 text-sm whitespace-pre-wrap text-black'>{selected.message}</div>
            <div className='space-y-3 max-h-40 overflow-y-auto mb-4'>
              {selected.replies?.map((r, idx) => (
                <div key={r.at || idx} className={`p-3 rounded-md border ${r.customerReply ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} text-black`}>
                  <div className='text-xs text-gray-500 flex items-center gap-2'>
                    <span>{new Date(r.at).toLocaleString()}</span>
                    {r.customerReply ? (
                      <span className='px-2 py-0.5 bg-blue-500 text-white rounded text-xs font-semibold'>Customer</span>
                    ) : (
                      <span className='px-2 py-0.5 bg-red-600 text-white rounded text-xs font-semibold'>Admin: {r.admin}</span>
                    )}
                  </div>
                  <div className='text-sm mt-2 whitespace-pre-wrap'>{r.message}</div>
                </div>
              ))}
              {selected.replies?.length === 0 && <p className='text-xs text-gray-500'>No replies yet.</p>}
            </div>
            {selected.status === 'open' ? (
              <>
                <textarea value={reply} onChange={e=> setReply(e.target.value)} placeholder='Type reply...' className='w-full h-28 rounded-md bg-white border-2 focus:ring-2 outline-none p-3 text-sm resize-none mb-3 text-black' style={{ borderColor: '#8C0009' }}/>
                <div className='flex flex-wrap gap-3'>
                  <button onClick={sendReply} className='px-5 py-2 rounded-md hover:opacity-90 text-sm font-semibold' style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}>Send Reply</button>
                  <button onClick={closeTicket} className='px-5 py-2 rounded-md bg-white border border-gray-300 text-sm font-semibold text-black' style={{ borderColor: '#d1d5db' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8C0009'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>Close Ticket</button>
                </div>
              </>
            ) : (
              <p className='text-sm font-medium text-red-500'>Ticket closed.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}