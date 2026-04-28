import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { societyNav } from '../../utils/navConfig';
import { societiesAPI } from '../../api';
import { format } from 'date-fns';

export default function SocietyEntryLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    societiesAPI.getEntryLogs().then(r=>setLogs(r.data.logs||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={societyNav} role="society_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Entry Logs</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Worker entry and exit records</p>
        </div>
      </div>
      {loading ? <div className="skeleton" style={{ height:200, borderRadius:12 }} /> : logs.length === 0 ? (
        <div className="empty-state"><h3>No entry logs</h3><p>Entry logs appear when workers enter/exit</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Worker</th><th>Flat</th><th>Entry Time</th><th>Exit Time</th><th>Status</th></tr></thead>
            <tbody>
              {logs.map(l=>(
                <tr key={l._id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}><div className="avatar" style={{ width:28, height:28, fontSize:'0.7rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{l.worker?.name?.[0]}</div><span style={{ fontWeight:600 }}>{l.worker?.name}</span></div></td>
                  <td>{l.flatNumber||l.user?.flatNumber||'—'}</td>
                  <td style={{ fontSize:'0.83rem' }}>{l.entryTime ? format(new Date(l.entryTime),'d MMM, h:mm a') : '—'}</td>
                  <td style={{ fontSize:'0.83rem' }}>{l.exitTime ? format(new Date(l.exitTime),'h:mm a') : '—'}</td>
                  <td><span className={`badge ${l.status==='entered'?'badge-blue':l.status==='exited'?'badge-green':'badge-red'}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
