import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { adminAPI } from '../../api';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [toggling, setToggling] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.getUsers({ search, role, limit:50 }).then(r=>setUsers(r.data.users||[])).catch(()=>{}).finally(()=>setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, role]);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await adminAPI.toggleUser(id);
      setUsers(prev=>prev.map(u=>u._id===id?{...u,isActive:res.data.user.isActive}:u));
      toast.success(res.data.message);
    } catch { toast.error('Action failed'); } finally { setToggling(''); }
  };

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Users</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Manage all platform users</p>
        </div>
      </div>
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)' }} />
          <input className="input" placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:'2.2rem' }} />
        </div>
        <select className="input" style={{ width:'auto' }} value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="worker">Worker</option>
          <option value="society_admin">Society Admin</option>
        </select>
      </div>
      {loading ? <div className="skeleton" style={{ height:250, borderRadius:12 }} /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No users found</td></tr>
              ) : users.map(u=>(
                <tr key={u._id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}><div className="avatar" style={{ width:28, height:28, fontSize:'0.7rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{u.name?.[0]}</div><span style={{ fontWeight:600 }}>{u.name}</span></div></td>
                  <td style={{ color:'var(--gray-500)', fontSize:'0.83rem' }}>{u.email}</td>
                  <td><span className="badge badge-blue" style={{ textTransform:'capitalize' }}>{u.role?.replace('_',' ')}</span></td>
                  <td style={{ fontSize:'0.82rem', color:'var(--gray-500)' }}>{u.createdAt ? format(new Date(u.createdAt),'d MMM yy') : '—'}</td>
                  <td><span className={`badge ${u.isActive?'badge-green':'badge-red'}`}>{u.isActive?'Active':'Suspended'}</span></td>
                  <td>
                    <button onClick={()=>handleToggle(u._id)} disabled={toggling===u._id} className={`btn btn-sm ${u.isActive?'btn-danger':'btn-outline'}`}>
                      {toggling===u._id?'...':u.isActive?'Suspend':'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
