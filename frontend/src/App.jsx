import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import PricingPage from './pages/public/PricingPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// User pages
import UserDashboard from './pages/user/Dashboard';
import UserBookService from './pages/user/BookService';
import UserBookings from './pages/user/Bookings';
import UserAttendance from './pages/user/Attendance';
import UserBilling from './pages/user/Billing';
import UserReviews from './pages/user/Reviews';
import UserNotifications from './pages/user/Notifications';
import UserProfile from './pages/user/Profile';

// Worker pages
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerJobs from './pages/worker/Jobs';
import WorkerSchedule from './pages/worker/Schedule';
import WorkerAttendance from './pages/worker/Attendance';
import WorkerEarnings from './pages/worker/Earnings';
import WorkerDocuments from './pages/worker/Documents';
import WorkerProfile from './pages/worker/Profile';

// Society pages
import SocietyDashboard from './pages/society/Dashboard';
import SocietyResidents from './pages/society/Residents';
import SocietyWorkers from './pages/society/Workers';
import SocietyEntryLogs from './pages/society/EntryLogs';
import SocietyComplaints from './pages/society/Complaints';
import SocietySettings from './pages/society/Settings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminWorkers from './pages/admin/Workers';
import AdminSocieties from './pages/admin/Societies';
import AdminBookings from './pages/admin/Bookings';
import AdminPayments from './pages/admin/Payments';
import AdminComplaints from './pages/admin/Complaints';
import AdminAnalytics from './pages/admin/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />

          {/* User panel */}
          <Route path="/user/dashboard" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/book-service" element={<ProtectedRoute roles={['user']}><UserBookService /></ProtectedRoute>} />
          <Route path="/user/bookings" element={<ProtectedRoute roles={['user']}><UserBookings /></ProtectedRoute>} />
          <Route path="/user/attendance" element={<ProtectedRoute roles={['user']}><UserAttendance /></ProtectedRoute>} />
          <Route path="/user/billing" element={<ProtectedRoute roles={['user']}><UserBilling /></ProtectedRoute>} />
          <Route path="/user/reviews" element={<ProtectedRoute roles={['user']}><UserReviews /></ProtectedRoute>} />
          <Route path="/user/notifications" element={<ProtectedRoute roles={['user']}><UserNotifications /></ProtectedRoute>} />
          <Route path="/user/profile" element={<ProtectedRoute roles={['user']}><UserProfile /></ProtectedRoute>} />

          {/* Worker panel */}
          <Route path="/worker/dashboard" element={<ProtectedRoute roles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/jobs" element={<ProtectedRoute roles={['worker']}><WorkerJobs /></ProtectedRoute>} />
          <Route path="/worker/schedule" element={<ProtectedRoute roles={['worker']}><WorkerSchedule /></ProtectedRoute>} />
          <Route path="/worker/attendance" element={<ProtectedRoute roles={['worker']}><WorkerAttendance /></ProtectedRoute>} />
          <Route path="/worker/earnings" element={<ProtectedRoute roles={['worker']}><WorkerEarnings /></ProtectedRoute>} />
          <Route path="/worker/documents" element={<ProtectedRoute roles={['worker']}><WorkerDocuments /></ProtectedRoute>} />
          <Route path="/worker/profile" element={<ProtectedRoute roles={['worker']}><WorkerProfile /></ProtectedRoute>} />

          {/* Society panel */}
          <Route path="/society/dashboard" element={<ProtectedRoute roles={['society_admin']}><SocietyDashboard /></ProtectedRoute>} />
          <Route path="/society/residents" element={<ProtectedRoute roles={['society_admin']}><SocietyResidents /></ProtectedRoute>} />
          <Route path="/society/workers" element={<ProtectedRoute roles={['society_admin']}><SocietyWorkers /></ProtectedRoute>} />
          <Route path="/society/entry-logs" element={<ProtectedRoute roles={['society_admin']}><SocietyEntryLogs /></ProtectedRoute>} />
          <Route path="/society/complaints" element={<ProtectedRoute roles={['society_admin']}><SocietyComplaints /></ProtectedRoute>} />
          <Route path="/society/settings" element={<ProtectedRoute roles={['society_admin']}><SocietySettings /></ProtectedRoute>} />

          {/* Admin panel */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['super_admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/workers" element={<ProtectedRoute roles={['super_admin']}><AdminWorkers /></ProtectedRoute>} />
          <Route path="/admin/societies" element={<ProtectedRoute roles={['super_admin']}><AdminSocieties /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute roles={['super_admin']}><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute roles={['super_admin']}><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute roles={['super_admin']}><AdminComplaints /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute roles={['super_admin']}><AdminAnalytics /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
