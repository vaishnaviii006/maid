import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { bookingsAPI } from '../../api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusBadge = { active:'badge-green', pending:'badge-yellow', cancelled:'badge-red', paused:'badge-gray', completed:'badge-blue' };

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    bookingsAPI.getMy().then(r => setBookings(r.data.bookings || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? This action cannot be undone.')) return;
    setCancelling(id);
    try {
      await bookingsAPI.cancel(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status:'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally { setCancelling(null); }
  };

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div className="section-header">
        <div><h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>My Bookings</h1>
        <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>All your service subscriptions</p></div>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:100, borderRadius:12 }} />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state"><h3>No bookings yet</h3><p>Book your first service from the Book Service page</p></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {bookings.map(b => (
            <div key={b._id} style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.25rem 1.5rem', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:'1.25rem', alignItems:'center' }}>
              <div className="avatar" style={{ width:46, height:46, fontSize:'1rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>
                {b.worker?.name?.[0]}
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.3rem' }}>
                  <p style={{ fontWeight:700, color:'var(--gray-900)' }}>{b.worker?.name}</p>
                  <span className={`badge ${statusBadge[b.status]||'badge-gray'}`}>{b.status}</span>
                </div>
                <p style={{ fontSize:'0.8rem', color:'var(--gray-500)', textTransform:'capitalize' }}>
                  {b.category?.replace('_',' ')} · {b.timeSlot?.start}–{b.timeSlot?.end} · ₹{b.monthlyAmount?.toLocaleString('en-IN')}/mo
                </p>
                <p style={{ fontSize:'0.75rem', color:'var(--gray-400)', marginTop:'0.2rem' }}>
                  Started {b.startDate ? format(new Date(b.startDate),'d MMM yyyy') : '—'} · Days: {b.days?.join(', ')}
                </p>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                {b.status === 'active' && (
                  <button onClick={() => handleCancel(b._id)} className="btn btn-danger btn-sm" disabled={cancelling===b._id}>
                    {cancelling===b._id ? '...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
