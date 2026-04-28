import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { societyNav } from '../../utils/navConfig';
import { societiesAPI, workersAPI } from '../../api';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SocietyWorkers() {
  const [society, setSociety] = useState(null);
  const [allWorkers, setAllWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState('');

  useEffect(() => {
    Promise.all([
      societiesAPI.getMine().catch(()=>({ data:{ society:null }})),
      workersAPI.getAll({ limit:50 }).catch(()=>({ data:{ workers:[] }})),
    ]).then(([s,w])=>{ setSociety(s.data.society); setAllWorkers(w.data.workers||[]); }).finally(()=>setLoading(false));
  }, []);

  const isApproved = (id) => (society?.approvedWorkers||[]).some(w => (w._id||w) === id);
  const isBlocked = (id) => (society?.blockedWorkers||[]).some(w => (w._id||w) === id);

  const handleApprove = async (id) => {
    setActing(id);
    try {
      await societiesAPI.approveWorker(id);
      toast.success('Worker approved for entry');
      societiesAPI.getMine().then(r=>setSociety(r.data.society));
    } catch { toast.error('Action failed'); } finally { setActing(''); }
  };

  const handleBlock = async (id) => {
    setActing(id);
    try {
      await societiesAPI.blockWorker(id);
      toast.success('Worker blocked');
      societiesAPI.getMine().then(r=>setSociety(r.data.society));
    } catch { toast.error('Action failed'); } finally { setActing(''); }
  };

  return (
    <DashboardLayout navItems={societyNav} role="society_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Workers</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Manage worker entry permissions for your society</p>
        </div>
      </div>
      {loading ? <div className="skeleton" style={{ height:200, borderRadius:12 }} /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Worker</th><th>Category</th><th>Rating</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {allWorkers.map(w=>(
                <tr key={w._id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}><div className="avatar" style={{ width:30, height:30, fontSize:'0.72rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{w.name[0]}</div><span style={{ fontWeight:600 }}>{w.name}</span></div></td>
                  <td style={{ textTransform:'capitalize' }}>{w.category?.replace('_',' ')}</td>
                  <td><div style={{ display:'flex', gap:'2px', alignItems:'center' }}><Star size={12} fill="#F59E0B" color="#F59E0B" /><span style={{ fontSize:'0.82rem' }}>{w.rating}</span></div></td>
                  <td>
                    {isApproved(w._id) ? <span className="badge badge-green">Approved</span> :
                     isBlocked(w._id) ? <span className="badge badge-red">Blocked</span> :
                     <span className="badge badge-gray">Pending</span>}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:'0.4rem' }}>
                      {!isApproved(w._id) && <button className="btn btn-primary btn-sm" onClick={()=>handleApprove(w._id)} disabled={acting===w._id}>Approve</button>}
                      {!isBlocked(w._id) && <button className="btn btn-danger btn-sm" onClick={()=>handleBlock(w._id)} disabled={acting===w._id}>Block</button>}
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
