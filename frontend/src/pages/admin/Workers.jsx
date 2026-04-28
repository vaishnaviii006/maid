import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { workersAPI } from '../../api';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [acting, setActing] = useState('');

  const fetchWorkers = () => {
    setLoading(true);
    workersAPI.getAllAdmin({ status, limit:50 }).then(r=>setWorkers(r.data.workers||[])).catch(()=>{}).finally(()=>setLoading(false));
  };

  useEffect(() => { fetchWorkers(); }, [status]);

  const updateStatus = async (id, newStatus) => {
    setActing(id);
    try {
      await workersAPI.updateStatus(id, newStatus);
      setWorkers(prev=>prev.map(w=>w._id===id?{...w,status:newStatus}:w));
      toast.success(`Worker ${newStatus}`);
    } catch { toast.error('Failed'); } finally { setActing(''); }
  };

  const statusBadge = { approved:'badge-green', pending:'badge-yellow', suspended:'badge-red', inactive:'badge-gray' };

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Workers</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Approve, suspend, and manage all workers</p>
        </div>
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <select className="input" style={{ width:'auto' }} value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      {loading ? <div className="skeleton" style={{ height:250, borderRadius:12 }} /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Worker</th><th>Category</th><th>Rating</th><th>Experience</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {workers.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No workers found</td></tr>
              ) : workers.map(w=>(
                <tr key={w._id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}><div className="avatar" style={{ width:28, height:28, fontSize:'0.7rem', background:'#F0FDF4', color:'#059669', flexShrink:0 }}>{w.name[0]}</div><div><p style={{ fontWeight:600, fontSize:'0.85rem' }}>{w.name}</p><p style={{ fontSize:'0.72rem', color:'var(--gray-400)' }}>{w.phone}</p></div></div></td>
                  <td style={{ textTransform:'capitalize' }}>{w.category?.replace('_',' ')}</td>
                  <td><div style={{ display:'flex', gap:'2px', alignItems:'center' }}><Star size={12} fill="#F59E0B" color="#F59E0B" /><span style={{ fontSize:'0.82rem' }}>{w.rating}</span></div></td>
                  <td style={{ fontSize:'0.83rem' }}>{w.experience} yrs</td>
                  <td><span className={`badge ${statusBadge[w.status]||'badge-gray'}`}>{w.status}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:'0.4rem' }}>
                      {w.status !== 'approved' && <button className="btn btn-primary btn-sm" onClick={()=>updateStatus(w._id,'approved')} disabled={acting===w._id}>Approve</button>}
                      {w.status !== 'suspended' && <button className="btn btn-danger btn-sm" onClick={()=>updateStatus(w._id,'suspended')} disabled={acting===w._id}>Suspend</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
