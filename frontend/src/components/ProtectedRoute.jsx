import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleHomeMap = {
  user: '/user/dashboard',
  worker: '/worker/dashboard',
  society_admin: '/society/dashboard',
  super_admin: '/admin/dashboard',
};

export const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Loading...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHomeMap[user.role] || '/'} replace />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={roleHomeMap[user.role] || '/'} replace />;
  return children;
};
