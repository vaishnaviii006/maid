import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { adminAPI } from '../../api';
import { Users, UserCheck, CalendarDays, CreditCard, AlertCircle, Building } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r=>setStats(r.data.stats)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const cards = [
    { label:'Total Users', val: stats?.users||0, color:'#EEF2FF', icon:Users, ic:'var(--brand)' },
    { label:'Total Workers', val: stats?.workers||0, color:'#F0FDF4', icon:UserCheck, ic:'#059669' },
    { label:'Active Bookings', val: stats?.activeBookings||0, color:'#FFF7ED', icon:CalendarDays, ic:'#D97706' },
    { label:'Total Revenue', val: `₹${((stats?.revenue||0)/1000).toFixed(1)}K`, color:'#FDF4FF', icon:CreditCard, ic:'#7C3AED' },
    { label:'Open Complaints', val: stats?.openComplaints||0, color:'#FEF2F2', icon:AlertCircle, ic:'#DC2626' },
    { label:'Societies', val: stats?.societies||0, color:'#F0F9FF', icon:Building, ic:'#0EA5E9' },
  ];

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--gray-900)' }}>Admin Dashboard</h1>
        <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Platform overview and system health</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {cards.map(s=>(
          <div key={s.label} style={{ background:s.color, borderRadius:12, padding:'1.25rem 1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <p style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--gray-600)' }}>{s.label}</p>
              <s.icon size={16} color={s.ic} />
            </div>
            <p style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em' }}>{loading?'—':s.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1rem' }}>Quick Actions</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {[{label:'View Pending Workers', to:'/admin/workers', color:'#D97706'},{label:'Review Open Complaints', to:'/admin/complaints', color:'#DC2626'},{label:'Check Overdue Payments', to:'/admin/payments', color:'#7C3AED'},{label:'User Management', to:'/admin/users', color:'var(--brand)'}].map(a=>(
              <a key={a.label} href={a.to} style={{ padding:'0.7rem 0.9rem', background:'var(--gray-50)', borderRadius:9, fontSize:'0.85rem', fontWeight:600, color:a.color, textDecoration:'none', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                {a.label} <span>→</span>
              </a>
            ))}
          </div>
        </div>
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1rem' }}>System Status</p>
          {[{l:'API Server',v:'Operational',ok:true},{l:'Database',v:'Connected',ok:true},{l:'Auth Service',v:'Active',ok:true},{l:'Notification Service',v:'Active',ok:true}].map(item=>(
            <div key={item.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.55rem 0', borderBottom:'1px solid var(--gray-50)', fontSize:'0.85rem' }}>
              <span style={{ color:'var(--gray-600)' }}>{item.l}</span>
              <span style={{ color:item.ok?'var(--success)':'var(--danger)', fontWeight:600 }}>{item.ok?'●':''} {item.v}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
