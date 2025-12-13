import React, { useState } from 'react';
import { createGiftCard } from '../../services/giftCards';
import toast from 'react-hot-toast';

export default function GiftCardAdmin() {
  const [amount, setAmount] = useState(50);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createGiftCard({
        amount,
        recipientEmail,
        recipientName,
        senderName,
        message,
        expiryDate: expiryDate || undefined
      });
      setCreated(res.data);
      toast.success('Gift card created!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create gift card');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create Gift Card</h2>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Amount</label>
          <input type="number" min={1} value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Recipient Email</label>
          <input type="email" value={recipientEmail} onChange={e=>setRecipientEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Recipient Name</label>
          <input type="text" value={recipientName} onChange={e=>setRecipientName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Sender Name</label>
          <input type="text" value={senderName} onChange={e=>setSenderName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Message</label>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Expiry Date</label>
          <input type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded font-semibold" disabled={loading}>{loading ? 'Creating...' : 'Create Gift Card'}</button>
      </form>
      {created && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded">
          <div className="font-bold">Gift Card Created!</div>
          <div>Code: <span className="font-mono text-lg">{created.code}</span></div>
          <div>Amount: ${created.amount}</div>
          <div>Balance: ${created.balance}</div>
        </div>
      )}
    </div>
  );
}
