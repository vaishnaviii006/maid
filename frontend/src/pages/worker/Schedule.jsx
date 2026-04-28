import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { workerNav } from '../../utils/navConfig';
import { workersAPI } from '../../api';

export default function WorkerSchedule() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay()-1];

  useEffect(() => {
    workersAPI.getMyJobs().then(r=>setJobs((r.data.bookings||[]).filter(j=>j.status==='active'))).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={workerNav} role="worker">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Weekly Schedule</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Your work schedule for this week</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'0.5rem', marginBottom:'1.5rem' }}>
        {days.map(d=>(
          <div key={d} style={{ textAlign:'center', padding:'0.5rem', borderRadius:9, background: d===today ? 'var(--brand)' : 'white', border:'1px solid var(--gray-100)' }}>
            <p style={{ fontSize:'0.75rem', fontWeight:700, color: d===today ? 'white' : 'var(--gray-500)' }}>{d}</p>
            <p style={{ fontSize:'0.65rem', color: d===today ? 'rgba(255,255,255,0.8)' : 'var(--gray-400)', marginTop:'2px' }}>
              {jobs.filter(j=>j.days?.includes(d)).length} jobs
            </p>
          </div>
        ))}
      </div>
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {[1,2].map(i=><div key={i} className="skeleton" style={{ height:80, borderRadius:12 }} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state"><h3>No active jobs</h3></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {days.map(d => {
            const dayJobs = jobs.filter(j=>j.days?.includes(d));
            if (!dayJobs.length) return null;
            return (
              <div key={d}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                  <p style={{ fontWeight:700, color: d===today ? 'var(--brand)' : 'var(--gray-700)', fontSize:'0.88rem' }}>{d} {d===today ? '(Today)' : ''}</p>
                  <div style={{ flex:1, height:1, background:'var(--gray-100)' }} />
                </div>
                {dayJobs.map(j=>(
                  <div key={j._id} style={{ display:'flex', gap:'0.75rem', padding:'0.85rem 1rem', background:'white', borderRadius:10, border:'1px solid var(--gray-100)', marginBottom:'0.5rem', alignItems:'center' }}>
                    <div style={{ background: d===today?'var(--brand)':'var(--gray-100)', color: d===today?'white':'var(--gray-600)', borderRadius:8, padding:'0.4rem 0.6rem', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>
                      {j.timeSlot?.start}
                    </div>
                    <div className="avatar" style={{ width:32, height:32, fontSize:'0.78rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{j.user?.name?.[0]}</div>
                    <div>
                      <p style={{ fontWeight:600, color:'var(--gray-900)', fontSize:'0.88rem' }}>{j.user?.name}</p>
                      <p style={{ fontSize:'0.75rem', color:'var(--gray-500)' }}>Flat {j.user?.flatNumber} · {j.timeSlot?.start}–{j.timeSlot?.end}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
