import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, paymentsAPI, notificationsAPI } from '../../api';
import { Link } from 'react-router-dom';
import { CalendarDays, CreditCard, Bell, Star, Plus, ArrowRight } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingsAPI.getMy().catch(()=>({ data:{ bookings:[] }})),
      paymentsAPI.getMy().catch(()=>({ data:{ invoices:[] }})),
      notificationsAPI.getAll({ limit:5 }).catch(()=>({ data:{ notifications:[] }})),
    ]).then(([b,p,n])=>{
      setBookings(b.data.bookings||[]);
      setInvoices(p.data.invoices||[]);
      setNotifications(n.data.notifications||[]);
    }).finally(()=>setLoading(false));
  }, []);

  const active = bookings.filter(b=>b.status==='active');
  const pending = invoices.filter(i=>i.status==='pending');
  const unread = notifications.filter(n=>!n.isRead).length;

  const stats = [
    { label:'Active Services', val:active.length, color:'#EEF2FF', icon:CalendarDays, iconCol:'var(--brand)' },
    { label:'Pending Invoices', val:pending.length, color:'#FFF7ED', icon:CreditCard, iconCol:'#D97706' },
    { label:'Notifications', val:unread, color:'#FDF4FF', icon:Bell, iconCol:'#7C3AED' },
    { label:'Total Bookings', val:bookings.length, color:'#F0FDF4', icon:Star, iconCol:'#059669' },
  ];

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--gray-900)' }}>
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color:'var(--gray-500)', fontSize:'0.875rem', marginTop:'0.25rem' }}>Here's what's happening with your home services today.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:s.color, borderRadius:12, padding:'1.25rem 1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <p style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--gray-600)' }}>{s.label}</p>
              <s.icon size={17} color={s.iconCol} />
            </div>
            <p style={{ fontSize:'1.85rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em' }}>{loading?'—':s.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'1.5rem' }}>
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <div className="section-header">
            <p className="section-title">Active Bookings</p>
            <Link to="/user/bookings" className="btn btn-ghost btn-sm" style={{ fontSize:'0.8rem' }}>View all <ArrowRight size={13} /></Link>
          </div>
          {loading ? <div className="skeleton" style={{ height:80, borderRadius:10 }} /> :
           active.length === 0 ? (
            <div className="empty-state">
              <h3>No active bookings</h3>
              <p>Book your first service to get started</p>
              <Link to="/user/book-service" className="btn btn-primary btn-sm" style={{ marginTop:'1rem' }}><Plus size={14} /> Book Service</Link>
            </div>
          ) : active.map(b=>(
            <div key={b._id} style={{ display:'flex', gap:'0.9rem', alignItems:'center', padding:'0.85rem', background:'var(--gray-50)', borderRadius:10, marginBottom:'0.75rem' }}>
              <div className="avatar" style={{ width:38, height:38, fontSize:'0.85rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{b.worker?.name?.[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:700, color:'var(--gray-800)', fontSize:'0.88rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{b.worker?.name}</p>
                <p style={{ fontSize:'0.75rem', color:'var(--gray-500)', textTransform:'capitalize' }}>{b.category?.replace('_',' ')} · {b.timeSlot?.start}–{b.timeSlot?.end}</p>
              </div>
              <span className="badge badge-green">Active</span>
            </div>
          ))}
        </div>

        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <div className="section-header">
            <p className="section-title">Notifications</p>
            <Link to="/user/notifications" className="btn btn-ghost btn-sm" style={{ fontSize:'0.8rem' }}>All <ArrowRight size={13} /></Link>
          </div>
          {loading ? <div className="skeleton" style={{ height:80, borderRadius:10 }} /> :
           notifications.length === 0 ? <div className="empty-state"><h3>No notifications</h3></div> :
           notifications.slice(0,4).map(n=>(
            <div key={n._id} style={{ display:'flex', gap:'0.75rem', padding:'0.75rem 0', borderBottom:'1px solid var(--gray-50)' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:n.isRead?'var(--gray-200)':'var(--brand)', marginTop:'0.3rem', flexShrink:0 }} />
              <div>
                <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--gray-800)', marginBottom:'0.15rem' }}>{n.title}</p>
                <p style={{ fontSize:'0.75rem', color:'var(--gray-500)', lineHeight:1.5 }}>{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem', marginTop:'1.5rem' }}>
        <p className="section-title" style={{ marginBottom:'1.25rem' }}>Quick Actions</p>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {[{label:'Book a Service',to:'/user/book-service',color:'var(--brand)'},{label:'View Attendance',to:'/user/attendance',color:'var(--gray-700)'},{label:'Pay Invoice',to:'/user/billing',color:'#D97706'},{label:'Rate Worker',to:'/user/reviews',color:'#7C3AED'}].map(a=>(
            <Link key={a.label} to={a.to} className="btn btn-outline btn-sm" style={{ borderColor:a.color, color:a.color }}>{a.label}</Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
