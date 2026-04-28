import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { workerNav } from '../../utils/navConfig';
import { workersAPI, attendanceAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Star, Users, CreditCard, CalendarDays } from 'lucide-react';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({ present:0, absent:0, total:0 });
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    Promise.all([
      workersAPI.getMe().catch(()=>({ data:{ worker:null }})),
      workersAPI.getMyJobs().catch(()=>({ data:{ bookings:[] }})),
      attendanceAPI.getWorkerSummary({}).catch(()=>({ data:{ summary:{ present:0,absent:0,total:0 }}})),
    ]).then(([p, j, a]) => {
      setProfile(p.data.worker);
      setJobs(j.data.bookings || []);
      setSummary(a.data.summary || { present:0, absent:0, total:0 });
    }).finally(() => setLoading(false));
  }, []);

  const handleCheckIn = async () => {
    if (!jobs[0]) return;
    setCheckingIn(true);
    try {
      await attendanceAPI.checkIn({ bookingId: jobs[0]._id });
      setCheckedIn(true);
    } catch (e) {
      setCheckedIn(true);
    } finally { setCheckingIn(false); }
  };

  const stats = [
    { label:'Active Clients', val: jobs.filter(j=>j.status==='active').length, color:'#EEF2FF', icon:Users, ic:'var(--brand)' },
    { label:'Present This Month', val: summary.present, color:'#F0FDF4', icon:CalendarDays, ic:'#059669' },
    { label:'Rating', val: profile?.rating || '—', color:'#FFF7ED', icon:Star, ic:'#D97706' },
    { label:'Total Earnings', val: `₹${(profile?.totalEarnings||0).toLocaleString('en-IN')}`, color:'#FDF4FF', icon:CreditCard, ic:'#7C3AED' },
  ];

  return (
    <DashboardLayout navItems={workerNav} role="worker">
      <div style={{ marginBottom:'1.75rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--gray-900)' }}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>
            Status: <span style={{ color: profile?.status==='approved' ? 'var(--success)' : 'var(--warning)', fontWeight:600, textTransform:'capitalize' }}>{profile?.status || 'pending'}</span>
          </p>
        </div>
        {jobs.length > 0 && (
          <button onClick={handleCheckIn} disabled={checkingIn || checkedIn} className={`btn ${checkedIn ? 'btn-outline' : 'btn-primary'}`}>
            {checkedIn ? '✓ Checked In' : checkingIn ? 'Checking in...' : 'Check In Now'}
          </button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:s.color, borderRadius:12, padding:'1.25rem 1.5rem', border:'none' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
              <p style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--gray-600)' }}>{s.label}</p>
              <s.icon size={16} color={s.ic} />
            </div>
            <p style={{ fontSize:'1.7rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em' }}>{loading ? '—' : s.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'1.5rem' }}>
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.25rem' }}>Today's Schedule</p>
          {loading ? <div className="skeleton" style={{ height:80, borderRadius:8 }} /> :
           jobs.filter(j=>j.status==='active').length === 0 ? (
            <div className="empty-state"><h3>No active jobs</h3><p>Accept a job to see your schedule</p></div>
          ) : jobs.filter(j=>j.status==='active').map(j => (
            <div key={j._id} style={{ display:'flex', gap:'0.9rem', padding:'0.85rem', background:'var(--gray-50)', borderRadius:10, marginBottom:'0.75rem' }}>
              <div className="avatar" style={{ width:38, height:38, fontSize:'0.82rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{j.user?.name?.[0]}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, color:'var(--gray-800)', fontSize:'0.88rem' }}>{j.user?.name}</p>
                <p style={{ fontSize:'0.75rem', color:'var(--gray-500)' }}>Flat {j.user?.flatNumber} · {j.timeSlot?.start}–{j.timeSlot?.end}</p>
              </div>
              <span className="badge badge-green">Active</span>
            </div>
          ))}
        </div>

        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.25rem' }}>Profile Completion</p>
          {['name','phone','bio','availability','kyc'].map(field => (
            <div key={field} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.5rem 0', borderBottom:'1px solid var(--gray-50)', fontSize:'0.83rem' }}>
              <span style={{ color:'var(--gray-600)', textTransform:'capitalize' }}>{field}</span>
              <span style={{ color: profile?.[field] ? 'var(--success)' : 'var(--warning)', fontWeight:600 }}>
                {profile?.[field] ? '✓ Done' : '✗ Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
