import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { notificationsAPI } from '../../api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const typeIcon = { booking_confirmed:'✅', payment_due:'💳', payment_received:'✅', worker_arrived:'🏠', replacement_assigned:'🔄', system_alert:'⚠️', complaint_update:'📋' };

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.getAll({ limit:50 }).then(r=>setNotifications(r.data.notifications||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const markRead = async (id) => {
    await notificationsAPI.markRead(id).catch(()=>{});
    setNotifications(prev=>prev.map(n=>n._id===id?{...n,isRead:true}:n));
  };

  const markAll = async () => {
    await notificationsAPI.markAllRead().catch(()=>{});
    setNotifications(prev=>prev.map(n=>({...n,isRead:true})));
    toast.success('All marked as read');
  };

  const unread = notifications.filter(n=>!n.isRead).length;

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Notifications</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>{unread} unread</p>
        </div>
        {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all read</button>}
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {[1,2,3,4].map(i=><div key={i} className="skeleton" style={{ height:70, borderRadius:10 }} />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state"><h3>No notifications</h3><p>You're all caught up!</p></div>
      ) : (
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', overflow:'hidden' }}>
          {notifications.map((n, i) => (
            <div key={n._id} onClick={()=>!n.isRead&&markRead(n._id)}
              style={{ display:'flex', gap:'0.9rem', padding:'1rem 1.25rem', borderBottom: i<notifications.length-1?'1px solid var(--gray-50)':'none', background:n.isRead?'white':'#F8FAFF', cursor:n.isRead?'default':'pointer', transition:'background 0.15s' }}>
              <span style={{ fontSize:'1.1rem', flexShrink:0, marginTop:'0.1rem' }}>{typeIcon[n.type]||'🔔'}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem' }}>
                  <p style={{ fontWeight: n.isRead ? 500 : 700, color:'var(--gray-900)', fontSize:'0.88rem' }}>{n.title}</p>
                  <p style={{ fontSize:'0.72rem', color:'var(--gray-400)', flexShrink:0 }}>{formatDistanceToNow(new Date(n.createdAt), {addSuffix:true})}</p>
                </div>
                <p style={{ fontSize:'0.8rem', color:'var(--gray-500)', lineHeight:1.55, marginTop:'0.2rem' }}>{n.message}</p>
              </div>
              {!n.isRead && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--brand)', flexShrink:0, marginTop:'0.45rem' }} />}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
