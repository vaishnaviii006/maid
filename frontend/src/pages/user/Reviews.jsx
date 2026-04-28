import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { ratingsAPI, bookingsAPI } from '../../api';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display:'flex', gap:'4px' }}>
      {[1,2,3,4,5].map(s=>(
        <button key={s} type="button" onMouseEnter={()=>setHovered(s)} onMouseLeave={()=>setHovered(0)} onClick={()=>onChange(s)} style={{ background:'none', border:'none', cursor:'pointer', padding:'2px' }}>
          <Star size={22} fill={(hovered||value)>=s?'#F59E0B':'transparent'} color="#F59E0B" />
        </button>
      ))}
    </div>
  );
}

export default function UserReviews() {
  const [ratings, setRatings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bookingId:'', workerId:'', rating:5, review:'', month:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ratingsAPI.getMy().then(r=>setRatings(r.data.ratings||[])).catch(()=>{});
    bookingsAPI.getMy().then(r=>setBookings((r.data.bookings||[]).filter(b=>b.status==='active'))).catch(()=>{});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await ratingsAPI.submit({ ...form, month: form.month || format(new Date(),'yyyy-MM') });
      setRatings(prev=>[res.data.rating, ...prev]);
      toast.success('Review submitted!');
      setShowForm(false);
      setForm({ bookingId:'', workerId:'', rating:5, review:'', month:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Reviews & Ratings</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Rate your workers monthly</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowForm(true)}>+ Write Review</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal">
            <h2 style={{ fontWeight:800, marginBottom:'1.25rem', color:'var(--gray-900)' }}>Rate Your Worker</h2>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div>
                <label>Select Booking</label>
                <select className="input" value={form.bookingId} onChange={e=>{
                  const b=bookings.find(x=>x._id===e.target.value);
                  setForm({...form, bookingId:e.target.value, workerId:b?.worker?._id||''});
                }} required>
                  <option value="">Choose a booking</option>
                  {bookings.map(b=><option key={b._id} value={b._id}>{b.worker?.name} — {b.category?.replace('_',' ')}</option>)}
                </select>
              </div>
              <div>
                <label>Overall Rating</label>
                <StarInput value={form.rating} onChange={v=>setForm({...form,rating:v})} />
              </div>
              <div>
                <label>Month</label>
                <input className="input" type="month" value={form.month} onChange={e=>setForm({...form,month:e.target.value})} required />
              </div>
              <div>
                <label>Review (optional)</label>
                <textarea className="input" rows={3} placeholder="Share your experience..." value={form.review} onChange={e=>setForm({...form,review:e.target.value})} style={{ resize:'none' }} />
              </div>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button type="button" onClick={()=>setShowForm(false)} className="btn btn-outline" style={{ flex:1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex:2 }} disabled={submitting}>{submitting?'Submitting...':'Submit Review'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ratings.length === 0 ? (
        <div className="empty-state"><h3>No reviews yet</h3><p>Rate your worker after their first month</p></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {ratings.map(r=>(
            <div key={r._id} style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', marginBottom:'0.75rem' }}>
                <div className="avatar" style={{ width:38, height:38, fontSize:'0.85rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{r.worker?.name?.[0]}</div>
                <div>
                  <p style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'0.9rem' }}>{r.worker?.name}</p>
                  <p style={{ fontSize:'0.75rem', color:'var(--gray-500)', textTransform:'capitalize' }}>{r.worker?.category?.replace('_',' ')} · {r.month}</p>
                </div>
                <div style={{ marginLeft:'auto', display:'flex', gap:'2px' }}>
                  {[1,2,3,4,5].map(s=><Star key={s} size={14} fill={s<=r.rating?'#F59E0B':'transparent'} color="#F59E0B" />)}
                </div>
              </div>
              {r.review && <p style={{ fontSize:'0.85rem', color:'var(--gray-600)', lineHeight:1.65, fontStyle:'italic' }}>"{r.review}"</p>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
