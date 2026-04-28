import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { bookingsAPI, attendanceAPI } from '../../api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const statusColor = { present:'#16A34A', absent:'#DC2626', half_day:'#D97706', holiday:'#6B7280' };
const statusBg = { present:'#DCFCE7', absent:'#FEE2E2', half_day:'#FEF3C7', holiday:'#F3F4F6' };

export default function UserAttendance() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState('');
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(format(new Date(),'yyyy-MM'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bookingsAPI.getMy().then(r => {
      const active = (r.data.bookings||[]).filter(b=>b.status==='active');
      setBookings(active);
      if (active.length > 0) setSelected(active[0]._id);
    }).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    attendanceAPI.getByBooking(selected, { month }).then(r => setRecords(r.data.records||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [selected, month]);

  const [year, m] = month.split('-');
  const monthStart = startOfMonth(new Date(Number(year), Number(m)-1));
  const monthEnd = endOfMonth(new Date(Number(year), Number(m)-1));
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const getRecord = (day) => records.find(r => isSameDay(new Date(r.date), day));
  const present = records.filter(r=>['present','half_day'].includes(r.status)).length;
  const absent = records.filter(r=>r.status==='absent').length;

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Attendance Calendar</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Track your worker's daily attendance</p>
        </div>
      </div>
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <select className="input" style={{ width:'auto' }} value={selected} onChange={e=>setSelected(e.target.value)}>
          <option value="">Select booking</option>
          {bookings.map(b=><option key={b._id} value={b._id}>{b.worker?.name} — {b.category?.replace('_',' ')}</option>)}
        </select>
        <input className="input" type="month" style={{ width:'auto' }} value={month} onChange={e=>setMonth(e.target.value)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[{l:'Present',v:present,bg:'#DCFCE7',c:'#16A34A'},{l:'Absent',v:absent,bg:'#FEE2E2',c:'#DC2626'},{l:'Total Marked',v:records.length,bg:'var(--brand-light)',c:'var(--brand)'}].map(s=>(
          <div key={s.l} style={{ background:s.bg, borderRadius:10, padding:'1rem 1.25rem' }}>
            <p style={{ fontSize:'1.6rem', fontWeight:800, color:s.c }}>{s.v}</p>
            <p style={{ fontSize:'0.78rem', color:'var(--gray-600)', fontWeight:500 }}>{s.l}</p>
          </div>
        ))}
      </div>
      <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', marginBottom:'0.5rem' }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(
            <div key={d} style={{ textAlign:'center', fontSize:'0.72rem', fontWeight:700, color:'var(--gray-400)', padding:'0.4rem 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
          {Array(((monthStart.getDay()+6)%7)).fill(null).map((_,i)=><div key={`e${i}`} />)}
          {allDays.map(day=>{
            const rec = getRecord(day);
            return (
              <div key={day.toISOString()} style={{ padding:'0.5rem 0.25rem', borderRadius:8, textAlign:'center', background:rec?statusBg[rec.status]:'var(--gray-50)', border:`1px solid ${rec?statusColor[rec.status]+'40':'transparent'}` }}>
                <p style={{ fontSize:'0.78rem', fontWeight:600, color:rec?statusColor[rec.status]:'var(--gray-400)' }}>{format(day,'d')}</p>
                {rec&&<p style={{ fontSize:'0.55rem', color:statusColor[rec.status], fontWeight:700, textTransform:'uppercase', marginTop:'1px' }}>{rec.status[0].toUpperCase()}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
