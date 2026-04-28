import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Menu, X, LogOut, Bell } from 'lucide-react';

export default function DashboardLayout({ children, navItems, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const roleColors = {
    user: '#1B4FD8', worker: '#059669', society_admin: '#7C3AED', super_admin: '#DC2626'
  };
  const brandColor = roleColors[role] || '#1B4FD8';

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={15} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gray-900)' }}>HomeHelp<span style={{ color: brandColor }}>+</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} className="sidebar-close">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.85rem', background: `${brandColor}18`, color: brandColor }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={`sidebar-link${location.pathname === to ? ' active' : ''}`}
              style={{ '--brand': brandColor }}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={handleLogout} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', width: '100%' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} className="sidebar-open-btn">
            <Menu size={22} />
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to={`/${role === 'super_admin' ? 'admin' : role === 'society_admin' ? 'society' : role}/notifications`} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--gray-200)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--gray-600)' }}>
              <Bell size={17} />
            </Link>
            <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.82rem', background: `${brandColor}18`, color: brandColor, cursor: 'default' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-close { display: block !important; }
          .sidebar-open-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
