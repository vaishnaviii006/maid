import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { workersAPI, bookingsAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Star, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['all','maid','cook','nanny','elder_care'];

export default function BookService() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category:'all', city:'' });
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ timeSlot:{ start:'07:00', end:'09:00' }, days:['Mon','Tue','Wed','Thu','Fri','Sat'], notes:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = {};
    if (filter.category !== 'all') params.category = filter.category;
    if (filter.city) params.city = filter.city;
    workersAPI.getAll(params).then(r => setWorkers(r.data.workers || [])).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  const handleBook = async () => {
    if (!booking) return;
    setSubmitting(true);
    try {
      await bookingsAPI.create({
        workerId: booking._id, category: booking.category,
        timeSlot: form.timeSlot, days: form.days,
        startDate: new Date().toISOString(),
        monthlyAmount: booking.monthlyRate || 4500,
        address: user?.address || {}, notes: form.notes,
      });
      toast.success('Booking confirmed! 🎉');
      setBooking(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Book a Service</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Browse verified workers and start your subscription</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:180 }}>
          <Search size={15} style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)' }} />
          <input className="input" placeholder="Search by city..." value={filter.city} onChange={e => setFilter({...filter, city:e.target.value})} style={{ paddingLeft:'2.25rem' }} />
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter({...filter, category:c})}
              className={`btn btn-sm ${filter.category===c ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform:'capitalize' }}>
              {c === 'all' ? 'All' : c.replace('_',' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Workers grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:200, borderRadius:12 }} />)}
        </div>
      ) : workers.length === 0 ? (
        <div className="empty-state"><h3>No workers found</h3><p>Try adjusting your filters</p></div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
          {workers.map(w => (
            <div key={w._id} className="worker-card">
              <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem', alignItems:'center' }}>
                <div className="avatar" style={{ width:44, height:44, fontSize:'1rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{w.name[0]}</div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'0.9rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{w.name}</p>
                  <p style={{ fontSize:'0.75rem', color:'var(--gray-500)', textTransform:'capitalize' }}>{w.category?.replace('_',' ')}</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:'2px', marginBottom:'0.5rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= Math.round(w.rating) ? '#F59E0B' : 'transparent'} color="#F59E0B" />)}
                <span style={{ fontSize:'0.72rem', color:'var(--gray-500)', marginLeft:'0.35rem' }}>{w.rating} ({w.totalRatings})</span>
              </div>
              <p style={{ fontSize:'0.78rem', color:'var(--gray-600)', marginBottom:'0.75rem', lineHeight:1.5 }}>{w.bio?.slice(0,80)}...</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <p style={{ fontWeight:700, color:'var(--brand)', fontSize:'0.88rem' }}>₹{w.monthlyRate?.toLocaleString('en-IN')}/mo</p>
                <button onClick={() => setBooking(w)} className="btn btn-primary btn-sm">Book</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking modal */}
      {booking && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setBooking(null)}>
          <div className="modal">
            <h2 style={{ fontWeight:800, color:'var(--gray-900)', marginBottom:'0.35rem' }}>Book {booking.name}</h2>
            <p style={{ color:'var(--gray-500)', fontSize:'0.85rem', marginBottom:'1.5rem', textTransform:'capitalize' }}>{booking.category?.replace('_',' ')} · ₹{booking.monthlyRate?.toLocaleString('en-IN')}/month</p>

            <div style={{ marginBottom:'1rem' }}>
              <label>Time Slot</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                <div><label style={{ fontSize:'0.72rem' }}>Start</label><input className="input" type="time" value={form.timeSlot.start} onChange={e => setForm({...form, timeSlot:{...form.timeSlot, start:e.target.value}})} /></div>
                <div><label style={{ fontSize:'0.72rem' }}>End</label><input className="input" type="time" value={form.timeSlot.end} onChange={e => setForm({...form, timeSlot:{...form.timeSlot, end:e.target.value}})} /></div>
              </div>
            </div>

            <div style={{ marginBottom:'1rem' }}>
              <label>Working Days</label>
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <button key={d} type="button" onClick={() => {
                    const newDays = form.days.includes(d) ? form.days.filter(x=>x!==d) : [...form.days, d];
                    setForm({...form, days:newDays});
                  }} style={{ padding:'0.3rem 0.65rem', borderRadius:7, border:`1.5px solid ${form.days.includes(d) ? 'var(--brand)' : 'var(--gray-200)'}`, background: form.days.includes(d) ? 'var(--brand-light)' : 'white', color: form.days.includes(d) ? 'var(--brand)' : 'var(--gray-600)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:'1.5rem' }}>
              <label>Notes (optional)</label>
              <textarea className="input" rows={2} placeholder="Any specific instructions..." value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} style={{ resize:'none' }} />
            </div>

            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={() => setBooking(null)} className="btn btn-outline" style={{ flex:1 }}>Cancel</button>
              <button onClick={handleBook} className="btn btn-primary" style={{ flex:2 }} disabled={submitting}>
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
