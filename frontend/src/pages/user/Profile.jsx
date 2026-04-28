import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userNav } from '../../utils/navConfig';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name:'', phone:'', flatNumber:'', address:{ city:'', state:'', pincode:'' } });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name:user.name||'', phone:user.phone||'', flatNumber:user.flatNumber||'', address:{ city:user.address?.city||'', state:user.address?.state||'', pincode:user.address?.pincode||'' } });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      await authAPI.changePassword(pwForm);
      toast.success('Password changed successfully');
      setPwForm({ currentPassword:'', newPassword:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setChangingPw(false); }
  };

  return (
    <DashboardLayout navItems={userNav} role="user">
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>My Profile</h1>
        <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Manage your personal information and preferences</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* Profile form */}
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', marginBottom:'1.5rem', paddingBottom:'1.25rem', borderBottom:'1px solid var(--gray-100)' }}>
            <div className="avatar" style={{ width:52, height:52, fontSize:'1.2rem', background:'var(--brand-light)', color:'var(--brand)', fontWeight:800 }}>{user?.name?.[0]}</div>
            <div>
              <p style={{ fontWeight:700, color:'var(--gray-900)' }}>{user?.name}</p>
              <p style={{ fontSize:'0.8rem', color:'var(--gray-500)' }}>{user?.email}</p>
              <span className="badge badge-blue" style={{ marginTop:'0.25rem', textTransform:'capitalize' }}>{user?.role}</span>
            </div>
          </div>
          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
            <div><label>Full Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div><label>Phone Number</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required /></div>
            <div><label>Flat / Door Number</label><input className="input" placeholder="A-204" value={form.flatNumber} onChange={e=>setForm({...form,flatNumber:e.target.value})} /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              <div><label>City</label><input className="input" placeholder="Mumbai" value={form.address.city} onChange={e=>setForm({...form,address:{...form.address,city:e.target.value}})} /></div>
              <div><label>State</label><input className="input" placeholder="Maharashtra" value={form.address.state} onChange={e=>setForm({...form,address:{...form.address,state:e.target.value}})} /></div>
            </div>
            <div><label>Pincode</label><input className="input" placeholder="400001" value={form.address.pincode} onChange={e=>setForm({...form,address:{...form.address,pincode:e.target.value}})} /></div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Changes'}</button>
          </form>
        </div>

        {/* Password form */}
        <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
          <h2 style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'1rem', marginBottom:'1.25rem' }}>Change Password</h2>
          <form onSubmit={handlePwChange} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
            <div><label>Current Password</label><input className="input" type="password" value={pwForm.currentPassword} onChange={e=>setPwForm({...pwForm,currentPassword:e.target.value})} required /></div>
            <div><label>New Password</label><input className="input" type="password" placeholder="Min. 6 characters" value={pwForm.newPassword} onChange={e=>setPwForm({...pwForm,newPassword:e.target.value})} required /></div>
            <button type="submit" className="btn btn-outline" disabled={changingPw}>{changingPw?'Changing...':'Update Password'}</button>
          </form>

          <div style={{ marginTop:'2rem', padding:'1rem', background:'var(--gray-50)', borderRadius:10 }}>
            <p style={{ fontWeight:700, color:'var(--gray-800)', fontSize:'0.88rem', marginBottom:'0.5rem' }}>Account Status</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
                <span style={{ color:'var(--gray-500)' }}>Email</span>
                <span style={{ color:'var(--gray-800)', fontWeight:500 }}>{user?.email}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
                <span style={{ color:'var(--gray-500)' }}>Verified</span>
                <span style={{ color:user?.isVerified?'var(--success)':'var(--danger)', fontWeight:600 }}>{user?.isVerified?'Yes':'No'}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
                <span style={{ color:'var(--gray-500)' }}>Member since</span>
                <span style={{ color:'var(--gray-800)', fontWeight:500 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
