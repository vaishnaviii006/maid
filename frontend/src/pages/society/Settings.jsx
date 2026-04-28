import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { societyNav } from '../../utils/navConfig';
import { societiesAPI } from '../../api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SocietySettings() {
  const [form, setForm] = useState({
    name: '', registrationNumber: '', totalUnits: '',
    address: { street: '', city: '', state: '', pincode: '' },
    contactEmail: '', contactPhone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    societiesAPI.getMine()
      .then(r => {
        const s = r.data.society;
        if (s) setForm({
          name: s.name || '',
          registrationNumber: s.registrationNumber || '',
          totalUnits: s.totalUnits || '',
          address: s.address || { street: '', city: '', state: '', pincode: '' },
          contactEmail: s.contactEmail || '',
          contactPhone: s.contactPhone || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm(f => ({ ...f, address: { ...f.address, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await societiesAPI.update(form);
      toast.success('Society settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout navItems={societyNav} role="society_admin">
      <div style={{ display: 'grid', gap: '1rem' }}>
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 54 }} />)}
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout navItems={societyNav} role="society_admin">
      <div style={{ maxWidth: 680 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>Society Settings</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>Manage your society profile and contact information</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Basic info */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', padding: '1.4rem 1.6rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '1rem' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Society Name</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Enter society name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input className="form-input" name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="e.g. REG-2024-001" />
              </div>
              <div className="form-group">
                <label className="form-label">Total Units</label>
                <input className="form-input" type="number" name="totalUnits" value={form.totalUnits} onChange={handleChange} placeholder="e.g. 120" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', padding: '1.4rem 1.6rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '1rem' }}>Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Street Address</label>
                <input className="form-input" name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street / Block / Wing" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-input" name="address.pincode" value={form.address.pincode} onChange={handleChange} placeholder="400001" />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', padding: '1.4rem 1.6rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '1rem' }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input className="form-input" type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="admin@society.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input className="form-input" name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
