import { useState } from 'react';

const initialReviews = [
  { id:1, name:'Ava', rating:5, text:'Premium feel and fast delivery. Love the design aesthetics.' },
  { id:2, name:'Liam', rating:4, text:'Quality exceeded expectations. Would like more color options.' },
  { id:3, name:'Noah', rating:5, text:'Sturdy build, looks exactly like the photos. Highly recommended.' }
];

export default function ReviewsPage(){
  const [reviews,setReviews] = useState(initialReviews);
  const [draft,setDraft] = useState({ name:'', text:'', rating:5 });

  function submit(e){
    e.preventDefault();
    if(!draft.name || !draft.text) return;
    setReviews(r=> [...r,{ id: Date.now(), ...draft }]);
    setDraft({ name:'', text:'', rating:5 });
  }

  return (
    <div className="w-full h-full overflow-y-auto p-8 md:p-14 bg-white text-black">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <h1 className="text-3xl font-extrabold">Customer Reviews</h1>
        <div className="grid gap-6">
          {reviews.map(r=> (
            <div key={r.id} className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{r.name}</span>
                <span className="text-sm text-red-600">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-sm mt-2 text-gray-700">{r.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="mt-4 grid gap-6 p-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold">Add a Review</h2>
          <input placeholder="Your name" value={draft.name} onChange={e=> setDraft(d=> ({...d, name:e.target.value}))} className="px-4 py-4 text-lg rounded-lg bg-white text-black border-2 border-red-600 focus:border-red-700 outline-none" />
          <textarea placeholder="Share your experience" value={draft.text} rows={6} onChange={e=> setDraft(d=> ({...d, text:e.target.value}))} className="px-4 py-4 text-lg rounded-lg bg-white text-black border-2 border-red-600 focus:border-red-700 outline-none resize-none" />
          <div className="flex items-center gap-6">
            <label className="text-lg font-medium">Rating</label>
            <select value={draft.rating} onChange={e=> setDraft(d=> ({...d, rating:Number(e.target.value)}))} className="px-4 py-3 text-lg rounded-lg bg-white text-black border-2 border-red-600 focus:border-red-700 outline-none min-w-[100px]">
              {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <button className="px-8 py-4 text-lg font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition">Submit Review</button>
        </form>
      </div>
    </div>
  );
}