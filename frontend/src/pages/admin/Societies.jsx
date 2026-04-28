import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from '../../utils/navConfig';
import { societiesAPI } from '../../api';
import { MapPin, Users, Search, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  const map = { active: 'badge-success', inactive: 'badge-danger', pending: 'badge-warning' };
  return map[s] || 'badge';
};

export default function AdminSocieties() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    societiesAPI.getAll()
      .then(r => setSocieties(r.data.societies || []))
      .catch(() => setSocieties([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = societies.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.address?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={adminNav} role="super_admin">
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>Societies</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>All registered housing societies on the platform</p>
        </div>

        {/* Search */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Search size={17} color="var(--gray-400)" />
          <input
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem', color: 'var(--gray-800)', background: 'transparent' }}
            placeholder="Search by name or city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{filtered.length} found</span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
            <Building2 size={40} color="var(--gray-300)" style={{ marginBottom: 12 }} />
            <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }}>No societies found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {filtered.map(s => (
              <div key={s._id} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={20} color="var(--brand)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.95rem' }}>{s.name}</span>
                    <span className={statusBadge(s.status)}>{s.status || 'active'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', marginTop: 5, flexWrap: 'wrap' }}>
                    {s.address?.city && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        <MapPin size={12} /> {s.address.city}, {s.address.state}
                      </span>
                    )}
                    {s.totalUnits && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        <Users size={12} /> {s.totalUnits} units
                      </span>
                    )}
                    {s.registrationNumber && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontFamily: 'monospace' }}>
                        #{s.registrationNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', background: 'var(--gray-50)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
                    {s.approvedWorkers?.length || 0} workers approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
