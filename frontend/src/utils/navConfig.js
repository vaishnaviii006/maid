import {
  LayoutDashboard, Plus, ClipboardList, CalendarDays, CreditCard,
  Star, Bell, User, Briefcase, FileText, TrendingUp, Upload,
  Users, UserCheck, LogIn, AlertCircle, Building2, Settings,
  ShieldCheck, BarChart3
} from 'lucide-react';

export const userNav = [
  { label: 'Dashboard',     to: '/user/dashboard',    icon: LayoutDashboard },
  { label: 'Book Service',  to: '/user/book-service', icon: Plus },
  { label: 'My Bookings',   to: '/user/bookings',     icon: ClipboardList },
  { label: 'Attendance',    to: '/user/attendance',   icon: CalendarDays },
  { label: 'Billing',       to: '/user/billing',      icon: CreditCard },
  { label: 'Reviews',       to: '/user/reviews',      icon: Star },
  { label: 'Notifications', to: '/user/notifications',icon: Bell },
  { label: 'Profile',       to: '/user/profile',      icon: User },
];

export const workerNav = [
  { label: 'Dashboard',  to: '/worker/dashboard',  icon: LayoutDashboard },
  { label: 'My Jobs',    to: '/worker/jobs',        icon: Briefcase },
  { label: 'Schedule',   to: '/worker/schedule',    icon: CalendarDays },
  { label: 'Attendance', to: '/worker/attendance',  icon: UserCheck },
  { label: 'Earnings',   to: '/worker/earnings',    icon: TrendingUp },
  { label: 'Documents',  to: '/worker/documents',   icon: Upload },
  { label: 'Profile',    to: '/worker/profile',     icon: User },
];

export const societyNav = [
  { label: 'Dashboard',  to: '/society/dashboard',  icon: LayoutDashboard },
  { label: 'Residents',  to: '/society/residents',  icon: Users },
  { label: 'Workers',    to: '/society/workers',    icon: UserCheck },
  { label: 'Entry Logs', to: '/society/entry-logs', icon: LogIn },
  { label: 'Complaints', to: '/society/complaints', icon: AlertCircle },
  { label: 'Settings',   to: '/society/settings',   icon: Settings },
];

export const adminNav = [
  { label: 'Dashboard',  to: '/admin/dashboard',  icon: LayoutDashboard },
  { label: 'Users',      to: '/admin/users',       icon: Users },
  { label: 'Workers',    to: '/admin/workers',     icon: UserCheck },
  { label: 'Societies',  to: '/admin/societies',   icon: Building2 },
  { label: 'Bookings',   to: '/admin/bookings',    icon: ClipboardList },
  { label: 'Payments',   to: '/admin/payments',    icon: CreditCard },
  { label: 'Complaints', to: '/admin/complaints',  icon: AlertCircle },
  { label: 'Analytics',  to: '/admin/analytics',   icon: BarChart3 },
];
