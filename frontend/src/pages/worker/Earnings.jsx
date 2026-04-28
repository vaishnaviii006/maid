import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { workerNav } from '../../utils/navConfig';
import { workersAPI, paymentsAPI } from '../../api';

export default function WorkerEarnings() {
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workersAPI.getMe().then(r => {
      setProfile(r.data.worker);
      if (r.data.worker?._id) {
        paymentsAPI.getWorkerEarnings(r.data.worker._id, {})
          .then(p => setPayments(p.data.payments||[])).catch(()=>{});
      }
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const total = payments.reduce((s,p)=>s+p.totalAmount, 0);
  const thisMonth = new Date().toISOString().slice(0,7);
  const monthEarnings = payments.filter(p=>p.month===thisMonth).reduce((s,p)=>s+p.totalAmount,0);

  return (
    <DashboardLayout navItems={workerNav} role="worker">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>My Earnings</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Payment history and earnings summary</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[{l:'This Month',v:`₹${monthEarnings.toLocaleString('en-IN')}`,bg:'#EEF2FF',c:'var(--brand)'},
          {l:'Total Earned',v:`₹${total.toLocaleString('en-IN')}`,bg:'#F0FDF4',c:'#059669'},
          {l:'Payments',v:payments.length,bg:'#FFF7ED',c:'#D97706'}].map(s=>(
          <div key={s.l} style={{ background:s.bg, borderRadius:10, padding:'1.25rem 1.5rem' }}>
            <p style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--gray-600)', marginBottom:'0.5rem' }}>{s.l}</p>
            <p style={{ fontSize:'1.6rem', fontWeight:800, color:s.c }}>{loading?'—':s.v}</p>
          </div>
        ))}
      </div>
      {payments.length === 0 ? (
        <div className="empty-state"><h3>No earnings yet</h3><p>Earnings appear after your first paid invoice</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Client</th><th>Days Worked</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {payments.map(p=>(
                <tr key={p._id}>
                  <td style={{ fontWeight:600 }}>{p.month}</td>
                  <td>{p.user?.name||'—'}</td>
                  <td>{p.breakdown?.presentDays}/{p.breakdown?.workingDays}</td>
                  <td style={{ fontWeight:700 }}>₹{p.totalAmount?.toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${p.status==='paid'?'badge-green':'badge-yellow'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
