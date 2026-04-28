import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { workerNav } from '../../utils/navConfig';
import { attendanceAPI, workersAPI } from '../../api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusColor = { present:'#16A34A', absent:'#DC2626', half_day:'#D97706' };
const statusBg = { present:'#DCFCE7', absent:'#FEE2E2', half_day:'#FEF3C7' };

export default function WorkerAttendance() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ present:0, absent:0, total:0 });
  const [month, setMonth] = useState(format(new Date(),'yyyy-MM'));
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    workersAPI.getMyJobs().then(r=>setJobs((r.data.bookings||[]).filter(j=>j.status==='active'))).catch(()=>{});
  }, []);

  useEffect(() => {
    setLoading(true);
    attendanceAPI.getWorkerSummary({ month }).then(r => {
      setRecords(r.data.records || []);
      setSummary(r.data.summary || { present:0, absent:0, total:0 });
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, [month]);

  const handleCheckIn = async () => {
    if (!jobs[0]) return toast.error('No active job found');
    setMarking(true);
    try {
      await attendanceAPI.checkIn({ bookingId: jobs[0]._id });
      toast.success('Checked in successfully!');
      attendanceAPI.getWorkerSummary({ month }).then(r => { setRecords(r.data.records||[]); setSummary(r.data.summary||{}); });
    } catch (e) { toast.error('Check-in failed'); } finally { setMarking(false); }
  };

  const handleCheckOut = async () => {
    if (!jobs[0]) return toast.error('No active job found');
    setMarking(true);
    try {
      await attendanceAPI.checkOut({ bookingId: jobs[0]._id });
      toast.success('Checked out successfully!');
    } catch (e) { toast.error('Check-out failed'); } finally { setMarking(false); }
  };

  return (
    <DashboardLayout navItems={workerNav} role="worker">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>My Attendance</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Track your daily check-ins</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <button onClick={handleCheckIn} disabled={marking} className="btn btn-primary btn-sm">Check In</button>
          <button onClick={handleCheckOut} disabled={marking} className="btn btn-outline btn-sm">Check Out</button>
        </div>
      </div>

      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem' }}>
        <input className="input" type="month" style={{ width:'auto' }} value={month} onChange={e=>setMonth(e.target.value)} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[{l:'Present',v:summary.present,bg:'#DCFCE7',c:'#16A34A'},{l:'Absent',v:summary.absent,bg:'#FEE2E2',c:'#DC2626'},{l:'Total Days',v:summary.total,bg:'var(--brand-light)',c:'var(--brand)'}].map(s=>(
          <div key={s.l} style={{ background:s.bg, borderRadius:10, padding:'1rem 1.25rem' }}>
            <p style={{ fontSize:'1.65rem', fontWeight:800, color:s.c }}>{s.v}</p>
            <p style={{ fontSize:'0.78rem', color:'var(--gray-600)', fontWeight:500 }}>{s.l}</p>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Notes</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No records for this month</td></tr>
            ) : records.map(r => (
              <tr key={r._id}>
                <td style={{ fontWeight:600 }}>{format(new Date(r.date),'EEE, d MMM')}</td>
                <td>{r.checkIn || '—'}</td>
                <td>{r.checkOut || '—'}</td>
                <td>
                  <span className="badge" style={{ background:statusBg[r.status]||'#F3F4F6', color:statusColor[r.status]||'var(--gray-600)', textTransform:'capitalize' }}>
                    {r.status?.replace('_',' ')}
                  </span>
                </td>
                <td style={{ color:'var(--gray-500)', fontSize:'0.8rem' }}>{r.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
