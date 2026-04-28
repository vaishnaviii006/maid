import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { paymentsAPI } from '../../api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusBadge = { pending:'badge-yellow', paid:'badge-green', overdue:'badge-red', waived:'badge-gray' };

export default function UserBilling() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);
  const [method, setMethod] = useState('upi');

  useEffect(() => {
    paymentsAPI.getMy().then(r=>setInvoices(r.data.invoices||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const handlePay = async (inv) => {
    setPaying(inv._id);
    try {
      await paymentsAPI.pay(inv._id, { paymentMethod: method, transactionId: `TXN${Date.now()}` });
      setInvoices(prev => prev.map(i => i._id === inv._id ? { ...i, status:'paid', paidAt: new Date() } : i));
      toast.success('Payment successful! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setPaying(null); }
  };

  const pending = invoices.filter(i=>i.status==='pending');
  const totalDue = pending.reduce((s,i)=>s+i.totalAmount,0);

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Billing & Invoices</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Your monthly invoices and payment history</p>
        </div>
      </div>

      {totalDue > 0 && (
        <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:12, padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontWeight:700, color:'#92400E', fontSize:'0.92rem' }}>₹{totalDue.toLocaleString('en-IN')} pending</p>
            <p style={{ fontSize:'0.8rem', color:'#B45309' }}>{pending.length} invoice{pending.length>1?'s':''} awaiting payment</p>
          </div>
          <select className="input" style={{ width:'auto', fontSize:'0.82rem' }} value={method} onChange={e=>setMethod(e.target.value)}>
            <option value="upi">UPI</option>
            <option value="netbanking">Net Banking</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>
      )}

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {[1,2,3].map(i=><div key={i} className="skeleton" style={{ height:110, borderRadius:12 }} />)}
        </div>
      ) : invoices.length === 0 ? (
        <div className="empty-state"><h3>No invoices yet</h3><p>Invoices appear after your first billing cycle</p></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {invoices.map(inv=>(
            <div key={inv._id} style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.2rem' }}>
                    <p style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'0.95rem' }}>{inv.invoiceNumber}</p>
                    <span className={`badge ${statusBadge[inv.status]||'badge-gray'}`}>{inv.status}</span>
                  </div>
                  <p style={{ fontSize:'0.8rem', color:'var(--gray-500)' }}>{inv.worker?.name} · {inv.month}</p>
                </div>
                <p style={{ fontWeight:800, color:'var(--gray-900)', fontSize:'1.1rem' }}>₹{inv.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem', background:'var(--gray-50)', borderRadius:8, padding:'0.75rem', marginBottom:'0.75rem' }}>
                {[{l:'Base Fee',v:`₹${inv.breakdown?.baseFee?.toLocaleString('en-IN')}`},{l:'Present Days',v:inv.breakdown?.presentDays},{l:'Absent Deduction',v:`-₹${inv.breakdown?.absentDeduction}`},{l:'Due Date',v:inv.dueDate?format(new Date(inv.dueDate),'d MMM'):'—'}].map(d=>(
                  <div key={d.l} style={{ textAlign:'center' }}>
                    <p style={{ fontSize:'0.68rem', color:'var(--gray-500)', marginBottom:'0.2rem' }}>{d.l}</p>
                    <p style={{ fontWeight:700, color:'var(--gray-800)', fontSize:'0.82rem' }}>{d.v}</p>
                  </div>
                ))}
              </div>
              {inv.status === 'pending' && (
                <button onClick={()=>handlePay(inv)} className="btn btn-primary btn-sm" disabled={paying===inv._id}>
                  {paying===inv._id ? 'Processing...' : `Pay ₹${inv.totalAmount?.toLocaleString('en-IN')} via ${method.toUpperCase()}`}
                </button>
              )}
              {inv.status === 'paid' && inv.paidAt && (
                <p style={{ fontSize:'0.75rem', color:'var(--success)' }}>✓ Paid on {format(new Date(inv.paidAt),'d MMM yyyy')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
