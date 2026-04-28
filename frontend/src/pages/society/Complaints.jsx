import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { societyNav } from '../../utils/navConfig';
import { societiesAPI } from '../../api';
import { format } from 'date-fns';

const priorityBadge = { low:'badge-gray', medium:'badge-yellow', high:'badge-blue', urgent:'badge-red' };
const statusBadge = { open:'badge-yellow', in_review:'badge-blue', resolved:'badge-green', closed:'badge-gray' };

export default function SocietyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    societiesAPI.getComplaints().then(r=>setComplaints(r.data.complaints||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={societyNav} role="society_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Complaints</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Resident complaints and issues</p>
        </div>
      </div>
      {loading ? <div className="skeleton" style={{ height:200, borderRadius:12 }} /> : complaints.length === 0 ? (
        <div className="empty-state"><h3>No complaints</h3><p>All quiet on the home front 🎉</p></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {complaints.map(c=>(
            <div key={c._id} style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.65rem' }}>
                <div>
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.25rem' }}>
                    <p style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'0.92rem' }}>{c.subject}</p>
                    <span className={`badge ${priorityBadge[c.priority]||'badge-gray'}`}>{c.priority}</span>
                    <span className={`badge ${statusBadge[c.status]||'badge-gray'}`}>{c.status?.replace('_',' ')}</span>
                  </div>
                  <p style={{ fontSize:'0.78rem', color:'var(--gray-500)' }}>From: {c.raisedBy?.name} · {c.createdAt ? format(new Date(c.createdAt),'d MMM yyyy') : ''}</p>
                </div>
                <span className="badge badge-blue" style={{ textTransform:'capitalize' }}>{c.category}</span>
              </div>
              <p style={{ fontSize:'0.85rem', color:'var(--gray-600)', lineHeight:1.6 }}>{c.description}</p>
              {c.resolution && <div style={{ marginTop:'0.75rem', background:'#F0FDF4', borderRadius:8, padding:'0.65rem 0.85rem', fontSize:'0.82rem', color:'#15803D' }}>✓ Resolution: {c.resolution}</div>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
