import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleHomeMap = { user: '/user/dashboard', worker: '/worker/dashboard', society_admin: '/society/dashboard', super_admin: '/admin/dashboard' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const from = location.state?.from?.pathname || roleHomeMap[user.role] || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const demoAccounts = [
    { label: 'User', email: 'priya@example.com', password: 'User@123', color: '#1B4FD8' },
    { label: 'Worker', email: 'sunita.devi@worker.in', password: 'Worker@123', color: '#059669' },
    { label: 'Admin', email: 'admin@homehelp.in', password: 'Admin@123', color: '#DC2626' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gray-50)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--gray-900)' }}>HomeHelp<span style={{ color: 'var(--brand)' }}>+</span></span>
          </Link>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '2rem' }}>Sign in to manage your home services</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label>Email address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', marginTop: '0.25rem' }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: '1.75rem', padding: '1rem', background: 'white', borderRadius: 10, border: '1px solid var(--gray-100)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Demo Login</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {demoAccounts.map(acc => (
                <button key={acc.label} onClick={() => setForm({ email: acc.email, password: acc.password })}
                  style={{ padding: '0.3rem 0.7rem', borderRadius: 6, border: `1px solid ${acc.color}30`, background: `${acc.color}08`, color: acc.color, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1B4FD8 0%, #0EA5E9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }} className="auth-right-panel">
        <div style={{ maxWidth: 380, color: 'white' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.04em' }}>
            TRUSTED BY 50,000+ FAMILIES
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Reliable domestic help, every single day
          </h2>
          <p style={{ opacity: 0.8, lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
            Verified workers, transparent billing, attendance tracking — everything you need for a smoothly running home.
          </p>
          {[
            '✓ Background-verified workers',
            '✓ Monthly subscription model',
            '✓ Automatic attendance tracking',
            '✓ Transparent billing with deductions',
          ].map(f => <p key={f} style={{ opacity: 0.85, marginBottom: '0.6rem', fontSize: '0.9rem' }}>{f}</p>)}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .auth-right-panel { display: none; } }`}</style>
    </div>
  );
}
