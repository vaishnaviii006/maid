import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { workerNav } from '../../utils/navConfig';
import { workersAPI } from '../../api';
import { format } from 'date-fns';

const statusBadge = { active:'badge-green', pending:'badge-yellow', cancelled:'badge-red', completed:'badge-blue' };

export default function WorkerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workersAPI.getMyJobs().then(r=>setJobs(r.data.bookings||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={workerNav} role="worker">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>My Jobs</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>All active and past client bookings</p>
        </div>
      </div>
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {[1,2,3].map(i=><div key={i} className="skeleton" style={{ height:100, borderRadius:12 }} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state"><h3>No jobs yet</h3><p>Jobs appear when a household books you</p></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {jobs.map(j => (
            <div key={j._id} style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
                <div className="avatar" style={{ width:44, height:44, fontSize:'1rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{j.user?.name?.[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.25rem' }}>
                    <p style={{ fontWeight:700, color:'var(--gray-900)' }}>{j.user?.name}</p>
                    <span className={`badge ${statusBadge[j.status]||'badge-gray'}`}>{j.status}</span>
                  </div>
                  <p style={{ fontSize:'0.8rem', color:'var(--gray-500)' }}>
                    Flat {j.user?.flatNumber || '—'} · {j.timeSlot?.start}–{j.timeSlot?.end} · Days: {j.days?.join(', ')}
                  </p>
                  <p style={{ fontSize:'0.75rem', color:'var(--gray-400)', marginTop:'0.2rem' }}>
                    ₹{j.monthlyAmount?.toLocaleString('en-IN')}/month · Since {j.startDate ? format(new Date(j.startDate),'MMM yyyy') : '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
