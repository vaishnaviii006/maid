import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { societyNav } from '../../utils/navConfig';
import { societiesAPI } from '../../api';

export default function SocietyResidents() {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    societiesAPI.getMine().then(r=>setSociety(r.data.society)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const residents = (society?.residents||[]).filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.flatNumber?.includes(search)
  );

  return (
    <DashboardLayout navItems={societyNav} role="society_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Residents</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>All registered residents in your society</p>
        </div>
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <input className="input" style={{ maxWidth:300 }} placeholder="Search by name or flat..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      {loading ? <div className="skeleton" style={{ height:200, borderRadius:12 }} /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Flat</th><th>Phone</th><th>Email</th><th>Status</th></tr></thead>
            <tbody>
              {residents.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No residents found</td></tr>
              ) : residents.map(r=>(
                <tr key={r._id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}><div className="avatar" style={{ width:30, height:30, fontSize:'0.72rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{r.name?.[0]}</div><span style={{ fontWeight:600 }}>{r.name}</span></div></td>
                  <td>{r.flatNumber||'—'}</td>
                  <td>{r.phone}</td>
                  <td style={{ color:'var(--gray-500)' }}>{r.email}</td>
                  <td><span className={`badge ${r.isActive?'badge-green':'badge-red'}`}>{r.isActive?'Active':'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
