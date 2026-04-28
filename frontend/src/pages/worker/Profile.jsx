import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { workerNav } from '../../utils/navConfig';
import { workersAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const categories = ['maid','cook','nanny','elder_care'];

export default function WorkerProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ bio:'', skills:'', languages:'', monthlyRate:'', availableDays:[], availability:{ morning:true, afternoon:false, evening:false }, serviceAreas:'', address:{ city:'', state:'' } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    workersAPI.getMe().then(r => {
      const w = r.data.worker;
      if (w) setForm({ bio:w.bio||'', skills:(w.skills||[]).join(', '), languages:(w.languages||[]).join(', '), monthlyRate:w.monthlyRate||'', availableDays:w.availableDays||[], availability:w.availability||{ morning:true, afternoon:false, evening:false }, serviceAreas:(w.serviceAreas||[]).join(', '), address:{ city:w.address?.city||'', state:w.address?.state||'' } });
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await workersAPI.updateMe({ ...form, skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean), languages:form.languages.split(',').map(s=>s.trim()).filter(Boolean), serviceAreas:form.serviceAreas.split(',').map(s=>s.trim()).filter(Boolean) });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const toggleDay = (d) => setForm(f => ({ ...f, availableDays: f.availableDays.includes(d) ? f.availableDays.filter(x=>x!==d) : [...f.availableDays, d] }));

  return (
    <DashboardLayout navItems={workerNav} role="worker">
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>Worker Profile</h1>
        <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Update your profile to attract more clients</p>
      </div>
      {loading ? <div className="skeleton" style={{ height:300, borderRadius:12 }} /> : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
          <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
            <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.25rem' }}>Basic Info</p>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
              <div><label>Bio / Introduction</label><textarea className="input" rows={3} placeholder="Briefly describe your experience..." value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} style={{ resize:'none' }} /></div>
              <div><label>Skills (comma separated)</label><input className="input" placeholder="Cooking, Cleaning, Child Care" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} /></div>
              <div><label>Languages (comma separated)</label><input className="input" placeholder="Hindi, English, Marathi" value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})} /></div>
              <div><label>Monthly Rate (₹)</label><input className="input" type="number" placeholder="5000" value={form.monthlyRate} onChange={e=>setForm({...form,monthlyRate:e.target.value})} /></div>
              <div><label>Service Areas (comma separated)</label><input className="input" placeholder="Mumbai, Thane" value={form.serviceAreas} onChange={e=>setForm({...form,serviceAreas:e.target.value})} /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                <div><label>City</label><input className="input" value={form.address.city} onChange={e=>setForm({...form,address:{...form.address,city:e.target.value}})} /></div>
                <div><label>State</label><input className="input" value={form.address.state} onChange={e=>setForm({...form,address:{...form.address,state:e.target.value}})} /></div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
            </form>
          </div>
          <div style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.5rem' }}>
            <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'1.25rem' }}>Availability</p>
            <div style={{ marginBottom:'1.25rem' }}>
              <label>Available Days</label>
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginTop:'0.4rem' }}>
                {days.map(d=>(
                  <button key={d} type="button" onClick={()=>toggleDay(d)} style={{ padding:'0.3rem 0.65rem', borderRadius:7, border:`1.5px solid ${form.availableDays.includes(d)?'var(--brand)':'var(--gray-200)'}`, background:form.availableDays.includes(d)?'var(--brand-light)':'white', color:form.availableDays.includes(d)?'var(--brand)':'var(--gray-600)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label>Time Slots</label>
              {[{key:'morning',label:'Morning (6AM–12PM)'},{key:'afternoon',label:'Afternoon (12PM–6PM)'},{key:'evening',label:'Evening (6PM–10PM)'}].map(slot=>(
                <label key={slot.key} style={{ display:'flex', alignItems:'center', gap:'0.65rem', padding:'0.6rem 0', cursor:'pointer', fontWeight:400, color:'var(--gray-700)', fontSize:'0.875rem', marginBottom:0 }}>
                  <input type="checkbox" checked={form.availability[slot.key]} onChange={e=>setForm({...form,availability:{...form.availability,[slot.key]:e.target.checked}})} />
                  {slot.label}
                </label>
              ))}
            </div>
            <div style={{ marginTop:'1.5rem', padding:'1rem', background:'var(--gray-50)', borderRadius:10 }}>
              <p style={{ fontWeight:700, color:'var(--gray-800)', fontSize:'0.88rem', marginBottom:'0.5rem' }}>Account Info</p>
              <p style={{ fontSize:'0.8rem', color:'var(--gray-500)' }}>{user?.email}</p>
              <p style={{ fontSize:'0.8rem', color:'var(--gray-500)' }}>{user?.phone}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
