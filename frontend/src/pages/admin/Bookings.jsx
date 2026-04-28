import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { bookingsAPI } from '../../api';
import { format } from 'date-fns';

const statusBadge = { active:'badge-green', pending:'badge-yellow', cancelled:'badge-red', completed:'badge-blue', paused:'badge-gray' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    bookingsAPI.getAllAdmin({ status, limit:50 }).then(r=>setBookings(r.data.bookings||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [status]);

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>All Bookings</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Monitor all platform subscriptions</p>
        </div>
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <select className="input" style={{ width:'auto' }} value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {loading ? <div className="skeleton" style={{ height:250, borderRadius:12 }} /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Worker</th><th>Category</th><th>Slot</th><th>Amount</th><th>Status</th><th>Started</th></tr></thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No bookings found</td></tr>
              ) : bookings.map(b=>(
                <tr key={b._id}>
                  <td style={{ fontWeight:600 }}>{b.user?.name||'—'}</td>
                  <td>{b.worker?.name||'—'}</td>
                  <td style={{ textTransform:'capitalize' }}>{b.category?.replace('_',' ')}</td>
                  <td style={{ fontSize:'0.82rem' }}>{b.timeSlot?.start}–{b.timeSlot?.end}</td>
                  <td style={{ fontWeight:700 }}>₹{b.monthlyAmount?.toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${statusBadge[b.status]||'badge-gray'}`}>{b.status}</span></td>
                  <td style={{ fontSize:'0.82rem', color:'var(--gray-500)' }}>{b.startDate ? format(new Date(b.startDate),'d MMM yy') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
