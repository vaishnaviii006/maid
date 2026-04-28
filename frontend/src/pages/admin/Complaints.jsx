import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { adminAPI } from '../../api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const priorityBadge = { low:'badge-gray', medium:'badge-yellow', high:'badge-blue', urgent:'badge-red' };
const statusBadge = { open:'badge-yellow', in_review:'badge-blue', resolved:'badge-green', closed:'badge-gray' };

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [resolving, setResolving] = useState('');
  const [resolution, setResolution] = useState({ id:'', text:'' });

  useEffect(() => {
    setLoading(true);
    adminAPI.getComplaints({ status, limit:50 }).then(r=>setComplaints(r.data.complaints||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [status]);

  const handleResolve = async () => {
    if (!resolution.id || !resolution.text) return;
    setResolving(resolution.id);
    try {
      await adminAPI.resolveComplaint(resolution.id, { resolution: resolution.text });
      setComplaints(prev=>prev.map(c=>c._id===resolution.id?{...c,status:'resolved',resolution:resolution.text}:c));
      toast.success('Complaint resolved');
      setResolution({ id:'', text:'' });
    } catch { toast.error('Failed to resolve'); } finally { setResolving(''); }
  };

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Complaints</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Review and resolve platform complaints</p>
        </div>
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <select className="input" style={{ width:'auto' }} value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {resolution.id && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setResolution({id:'',text:''})}>
          <div className="modal">
            <h2 style={{ fontWeight:800, marginBottom:'1rem', color:'var(--gray-900)' }}>Resolve Complaint</h2>
            <textarea className="input" rows={4} placeholder="Describe the resolution..." value={resolution.text} onChange={e=>setResolution({...resolution,text:e.target.value})} style={{ resize:'none', marginBottom:'1rem' }} />
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={()=>setResolution({id:'',text:''})} className="btn btn-outline" style={{ flex:1 }}>Cancel</button>
              <button onClick={handleResolve} className="btn btn-primary" style={{ flex:2 }} disabled={resolving===resolution.id}>{resolving?'Resolving...':'Mark Resolved'}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="skeleton" style={{ height:250, borderRadius:12 }} /> :
       complaints.length === 0 ? <div className="empty-state"><h3>No complaints</h3></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {complaints.map(c=>(
            <div key={c._id} style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                <div>
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.25rem' }}>
                    <p style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'0.92rem' }}>{c.subject}</p>
                    <span className={`badge ${priorityBadge[c.priority]}`}>{c.priority}</span>
                    <span className={`badge ${statusBadge[c.status]||'badge-gray'}`}>{c.status?.replace('_',' ')}</span>
                  </div>
                  <p style={{ fontSize:'0.78rem', color:'var(--gray-500)' }}>By {c.raisedBy?.name} · {c.createdAt ? format(new Date(c.createdAt),'d MMM yyyy') : ''} · Category: {c.category}</p>
                </div>
                {c.status === 'open' && (
                  <button onClick={()=>setResolution({id:c._id,text:''})} className="btn btn-primary btn-sm">Resolve</button>
                )}
              </div>
              <p style={{ fontSize:'0.85rem', color:'var(--gray-600)', lineHeight:1.6 }}>{c.description}</p>
              {c.resolution && <div style={{ marginTop:'0.75rem', background:'#F0FDF4', borderRadius:8, padding:'0.65rem', fontSize:'0.82rem', color:'#15803D' }}>✓ {c.resolution}</div>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
