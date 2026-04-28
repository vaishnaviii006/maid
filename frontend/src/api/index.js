import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const workersAPI = {
  getAll: (params) => api.get('/workers', { params }),
  getOne: (id) => api.get(`/workers/${id}`),
  getMe: () => api.get('/workers/me'),
  updateMe: (data) => api.put('/workers/me', data),
  getMyJobs: () => api.get('/workers/me/jobs'),
  uploadKyc: (data) => api.post('/workers/me/kyc', data),
  updateStatus: (id, status) => api.put(`/workers/${id}/status`, { status }),
  getAllAdmin: (params) => api.get('/workers/admin/all', { params }),
};

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getOne: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  requestReplacement: (id, data) => api.post(`/bookings/${id}/replacement`, data),
  getAllAdmin: (params) => api.get('/bookings/admin/all', { params }),
};

export const attendanceAPI = {
  mark: (data) => api.post('/attendance', data),
  getByBooking: (bookingId, params) => api.get(`/attendance/booking/${bookingId}`, { params }),
  checkIn: (data) => api.post('/attendance/checkin', data),
  checkOut: (data) => api.post('/attendance/checkout', data),
  getWorkerSummary: (params) => api.get('/attendance/worker/summary', { params }),
};

export const paymentsAPI = {
  generate: (data) => api.post('/payments/generate', data),
  getMy: () => api.get('/payments/my'),
  pay: (id, data) => api.put(`/payments/${id}/pay`, data),
  getWorkerEarnings: (workerId, params) => api.get(`/payments/worker/${workerId}/earnings`, { params }),
  getAllAdmin: (params) => api.get('/payments/admin/all', { params }),
};

export const ratingsAPI = {
  submit: (data) => api.post('/ratings', data),
  getMy: () => api.get('/ratings/my'),
  getForWorker: (workerId) => api.get(`/ratings/worker/${workerId}`),
};

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const societiesAPI = {
  getAll: (params) => api.get('/societies', { params }),
  create: (data) => api.post('/societies', data),
  getMine: () => api.get('/societies/mine'),
  updateMine: (data) => api.put('/societies/mine', data),
  update: (data) => api.put('/societies/mine', data), // alias
  approveWorker: (workerId) => api.put(`/societies/workers/${workerId}/approve`),
  blockWorker: (workerId) => api.put(`/societies/workers/${workerId}/block`),
  getEntryLogs: (params) => api.get('/societies/mine/entry-logs', { params }),
  getComplaints: () => api.get('/societies/mine/complaints'),
};

export const complaintsAPI = {
  create: (data) => api.post('/complaints', data),
  getMy: () => api.get('/complaints/my'),
  update: (id, data) => api.put(`/complaints/${id}`, data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getComplaints: (params) => api.get('/admin/complaints', { params }),
  resolveComplaint: (id, data) => api.put(`/admin/complaints/${id}/resolve`, data),
  getRevenue: () => api.get('/admin/analytics/revenue'),
};
