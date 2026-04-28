import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { adminAPI } from '../../api';

export default function AdminAnalytics() {
  const [data, setData] = useState({ monthly:[], byCategory:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getRevenue().then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const maxRevenue = Math.max(...(data.monthly||[]).map(m=>m.revenue), 1);
  const categoryColors = { maid:'var(--brand)', cook:'#059669', nanny:'#D97706', elder_care:'#7C3AED' };
  const totalRevenue = (data.monthly||[]).reduce((s,m)=>s+m.revenue,0);
  const totalBookings = (data.byCategory||[]).reduce((s,c)=>s+c.count,0);

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Analytics</h1>
        <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Platform revenue and booking insights</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.75rem' }}>
        {[{l:'Total Revenue',v:`₹${(totalRevenue/1000).toFixed(1)}K`,bg:'#F0FDF4',c:'#059669'},{l:'Total Bookings',v:totalBookings,bg:'var(--brand-light)',c:'var(--brand)'},{l:'Monthly Records',v:(data.monthly||[]).length,bg:'#FFF7ED',c:'#D97706'}].map(s=>(
          <div key={s.l} style={{ background:s.bg, borderRadius:10, padding:'1.25rem 1.5rem' }}>
            <p style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--gray-600)', marginBottom:'0.4rem' }}>{s.l}</p>
            <p style={{ fontSize:'1.6rem', fontWeight:800, color:s.c }}>{loading?'—':s.v}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'1.5rem' }}>
        {/* Revenue bar chart */}
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.5rem' }}>Monthly Revenue</p>
          {loading ? <div className="skeleton" style={{ height:200, borderRadius:8 }} /> :
           data.monthly.length === 0 ? <div className="empty-state"><h3>No revenue data</h3></div> : (
            <div style={{ display:'flex', alignItems:'flex-end', gap:'0.5rem', height:200 }}>
              {data.monthly.map(m=>(
                <div key={m._id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem' }}>
                  <p style={{ fontSize:'0.65rem', color:'var(--gray-500)', fontWeight:600 }}>₹{(m.revenue/1000).toFixed(1)}K</p>
                  <div style={{ width:'100%', background:'var(--brand)', borderRadius:'4px 4px 0 0', height:`${(m.revenue/maxRevenue)*160}px`, minHeight:4, transition:'height 0.3s' }} />
                  <p style={{ fontSize:'0.6rem', color:'var(--gray-400)' }}>{m._id?.slice(5)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category donut */}
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.5rem' }}>Bookings by Category</p>
          {loading ? <div className="skeleton" style={{ height:150, borderRadius:8 }} /> :
           data.byCategory.length === 0 ? <div className="empty-state"><h3>No data</h3></div> : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {data.byCategory.map(cat=>{
                const pct = totalBookings > 0 ? Math.round((cat.count/totalBookings)*100) : 0;
                const color = categoryColors[cat._id] || 'var(--gray-400)';
                return (
                  <div key={cat._id}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem', fontSize:'0.82rem' }}>
                      <span style={{ fontWeight:600, color:'var(--gray-700)', textTransform:'capitalize' }}>{cat._id?.replace('_',' ')}</span>
                      <span style={{ color:'var(--gray-500)' }}>{cat.count} ({pct}%)</span>
                    </div>
                    <div style={{ height:6, background:'var(--gray-100)', borderRadius:99 }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99, transition:'width 0.5s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
