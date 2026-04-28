import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { paymentsAPI } from '../../api';
import { format } from 'date-fns';

const statusBadge = { paid:'badge-green', pending:'badge-yellow', overdue:'badge-red', waived:'badge-gray' };

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const total = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.totalAmount,0);

  useEffect(() => {
    setLoading(true);
    paymentsAPI.getAllAdmin({ status, limit:50 }).then(r=>setPayments(r.data.payments||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [status]);

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Payments</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>All platform invoices and transactions</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[{l:'Total Revenue',v:`₹${total.toLocaleString('en-IN')}`,bg:'#F0FDF4',c:'#059669'},{l:'Total Invoices',v:payments.length,bg:'var(--brand-light)',c:'var(--brand)'},{l:'Pending',v:payments.filter(p=>p.status==='pending').length,bg:'#FEF3C7',c:'#D97706'}].map(s=>(
          <div key={s.l} style={{ background:s.bg, borderRadius:10, padding:'1rem 1.25rem' }}>
            <p style={{ fontSize:'0.75rem', color:'var(--gray-600)', fontWeight:600, marginBottom:'0.4rem' }}>{s.l}</p>
            <p style={{ fontSize:'1.5rem', fontWeight:800, color:s.c }}>{loading?'—':s.v}</p>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <select className="input" style={{ width:'auto' }} value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      {loading ? <div className="skeleton" style={{ height:200, borderRadius:12 }} /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice #</th><th>User</th><th>Worker</th><th>Month</th><th>Amount</th><th>Status</th><th>Paid On</th></tr></thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No payments found</td></tr>
              ) : payments.map(p=>(
                <tr key={p._id}>
                  <td style={{ fontWeight:600, fontSize:'0.82rem' }}>{p.invoiceNumber}</td>
                  <td>{p.user?.name||'—'}</td>
                  <td>{p.worker?.name||'—'}</td>
                  <td>{p.month}</td>
                  <td style={{ fontWeight:700 }}>₹{p.totalAmount?.toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${statusBadge[p.status]||'badge-gray'}`}>{p.status}</span></td>
                  <td style={{ fontSize:'0.8rem', color:'var(--gray-500)' }}>{p.paidAt ? format(new Date(p.paidAt),'d MMM yy') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
