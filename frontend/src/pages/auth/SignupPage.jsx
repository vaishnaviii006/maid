import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const roles = [
  { value: 'user', label: 'Household User', desc: 'I want to hire help' },
  { value: 'worker', label: 'Service Worker', desc: 'I want to offer services' },
  { value: 'society_admin', label: 'Society Admin', desc: 'I manage an apartment' },
];

const categories = [
  { value: 'maid', label: 'Maid / House Help' },
  { value: 'cook', label: 'Cook' },
  { value: 'nanny', label: 'Nanny / Babysitter' },
  { value: 'elder_care', label: 'Elder Caregiver' },
];

const roleHomeMap = { user: '/user/dashboard', worker: '/worker/dashboard', society_admin: '/society/dashboard' };

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user', category: 'maid' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to HomeHelp+, ${user.name.split(' ')[0]}!`);
      navigate(roleHomeMap[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gray-50)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 430 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--gray-900)' }}>HomeHelp<span style={{ color: 'var(--brand)' }}>+</span></span>
          </Link>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Create your account</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Join 50,000+ families on HomeHelp+</p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {roles.map(r => (
              <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                style={{ padding: '0.65rem 0.5rem', borderRadius: 9, border: `1.5px solid ${form.role === r.value ? 'var(--brand)' : 'var(--gray-200)'}`, background: form.role === r.value ? 'var(--brand-light)' : 'white', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: form.role === r.value ? 'var(--brand)' : 'var(--gray-700)' }}>{r.label}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: '0.2rem' }}>{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label>Full Name</label>
                <input className="input" placeholder="Priya Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label>Phone Number</label>
                <input className="input" placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>

            <div>
              <label>Email address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            {form.role === 'worker' && (
              <div>
                <label>Service Category</label>
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            )}

            <div>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>
              By creating an account, you agree to our <a href="#" style={{ color: 'var(--brand)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--brand)' }}>Privacy Policy</a>.
            </p>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}>
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <div style={{ flex: 1, background: 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }} className="auth-right-panel">
        <div style={{ maxWidth: 360, color: 'white' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.5rem', display: 'inline-block', letterSpacing: '0.04em' }}>
            FREE TO JOIN
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Start in minutes, save hours every week
          </h2>
          {['✓ No subscription fee to sign up', '✓ Choose your own time slots', '✓ Verified & background-checked workers', '✓ Cancel or pause anytime'].map(f => (
            <p key={f} style={{ opacity: 0.85, marginBottom: '0.65rem', fontSize: '0.9rem' }}>{f}</p>
          ))}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .auth-right-panel { display: none; } }`}</style>
    </div>
  );
}
