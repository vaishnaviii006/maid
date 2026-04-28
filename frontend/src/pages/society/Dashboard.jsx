import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { societyNav } from '../../utils/navConfig';
import { societiesAPI } from '../../api';
import { Users, UserCheck, ClipboardList, AlertCircle } from 'lucide-react';

export default function SocietyDashboard() {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    societiesAPI.getMine().then(r=>setSociety(r.data.society)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const stats = [
    { label:'Total Flats', val: society?.totalFlats||0, color:'#EEF2FF', icon:Users, ic:'var(--brand)' },
    { label:'Subscribed Flats', val: society?.subscribedFlats||0, color:'#F0FDF4', icon:UserCheck, ic:'#059669' },
    { label:'Approved Workers', val: society?.approvedWorkers?.length||0, color:'#FFF7ED', icon:ClipboardList, ic:'#D97706' },
    { label:'Total Residents', val: society?.residents?.length||0, color:'#FDF4FF', icon:AlertCircle, ic:'#7C3AED' },
  ];

  return (
    <DashboardLayout navItems={societyNav} role="society_admin">
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--gray-900)' }}>{loading ? 'Society Dashboard' : society?.name || 'Society Dashboard'}</h1>
        <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>{society?.address?.city}, {society?.address?.state}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:s.color, borderRadius:12, padding:'1.25rem 1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <p style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--gray-600)' }}>{s.label}</p>
              <s.icon size={16} color={s.ic} />
            </div>
            <p style={{ fontSize:'1.8rem', fontWeight:800, color:'var(--gray-900)' }}>{loading?'—':s.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.25rem' }}>Approved Workers</p>
          {loading ? <div className="skeleton" style={{ height:80, borderRadius:8 }} /> :
           (society?.approvedWorkers||[]).length === 0 ? (
            <div className="empty-state"><h3>No approved workers</h3><p>Approve workers from the Workers tab</p></div>
          ) : (society.approvedWorkers).slice(0,5).map(w=>(
            <div key={w._id||w} style={{ display:'flex', gap:'0.75rem', alignItems:'center', padding:'0.65rem 0', borderBottom:'1px solid var(--gray-50)' }}>
              <div className="avatar" style={{ width:32, height:32, fontSize:'0.75rem', background:'#F0FDF4', color:'#059669', flexShrink:0 }}>{typeof w === 'object' ? w.name?.[0] : 'W'}</div>
              <div>
                <p style={{ fontWeight:600, color:'var(--gray-800)', fontSize:'0.85rem' }}>{typeof w === 'object' ? w.name : 'Worker'}</p>
                <p style={{ fontSize:'0.72rem', color:'var(--gray-500)', textTransform:'capitalize' }}>{typeof w === 'object' ? w.category?.replace('_',' ') : ''}</p>
              </div>
              <span className="badge badge-green" style={{ marginLeft:'auto' }}>Approved</span>
            </div>
          ))}
        </div>

        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.25rem' }}>Society Info</p>
          {society && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {[{l:'Registration No.',v:society.registrationNumber||'—'},{l:'Contact Email',v:society.contactEmail||'—'},{l:'Contact Phone',v:society.contactPhone||'—'},{l:'Entry Approval',v:society.entryRules?.requiresApproval?'Required':'Not Required'}].map(item=>(
                <div key={item.l} style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid var(--gray-50)', fontSize:'0.83rem' }}>
                  <span style={{ color:'var(--gray-500)' }}>{item.l}</span>
                  <span style={{ color:'var(--gray-800)', fontWeight:500 }}>{item.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
