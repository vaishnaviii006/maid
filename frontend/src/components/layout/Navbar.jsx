import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ChevronDown, Home } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const roleHomeMap = {
  user: '/user/dashboard',
  worker: '/worker/dashboard',
  society_admin: '/society/dashboard',
  super_admin: '/admin/dashboard',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid var(--gray-100)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>
            HomeHelp<span style={{ color: 'var(--brand)' }}>+</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link${location.pathname === l.to ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 99, padding: '0.35rem 0.85rem 0.35rem 0.5rem', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)' }}>{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--gray-500)" />
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', top: '110%', right: 0, background: 'white', border: '1px solid var(--gray-100)', borderRadius: 10, minWidth: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '0.4rem', zIndex: 100 }}>
                  <Link to={roleHomeMap[user.role]} onClick={() => setDropOpen(false)} style={{ display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--gray-700)', textDecoration: 'none', borderRadius: 7, fontWeight: 500 }}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--danger)', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 7, fontWeight: 500, fontFamily: 'inherit' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} className="mobile-toggle">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: 'white', borderTop: '1px solid var(--gray-100)', padding: '1rem 1.5rem' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '0.6rem 0', fontSize: '0.9rem', fontWeight: 500, color: 'var(--gray-700)', textDecoration: 'none', borderBottom: '1px solid var(--gray-50)' }}>
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
