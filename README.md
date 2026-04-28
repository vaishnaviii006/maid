# HomeHelp+ 🏠

**India's trusted recurring domestic help management platform**

A full-stack production-ready web application for managing monthly domestic help subscriptions — maids, cooks, nannies, and elder caregivers — with attendance tracking, billing, and society integration.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS, React Router, Axios, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Role-based access control |

---

## Project Structure

```
maid/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── workerController.js
│   │   ├── attendanceController.js
│   │   ├── paymentController.js
│   │   ├── ratingController.js
│   │   ├── notificationController.js
│   │   ├── societyController.js
│   │   ├── adminController.js
│   │   └── complaintController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Worker.js
│   │   ├── Booking.js
│   │   ├── Attendance.js
│   │   ├── Payment.js
│   │   ├── Society.js
│   │   ├── Rating.js
│   │   ├── Notification.js
│   │   ├── Complaint.js
│   │   └── EntryLog.js
│   ├── routes/
│   │   ├── auth.js, bookings.js, workers.js
│   │   ├── attendance.js, payments.js, ratings.js
│   │   ├── notifications.js, societies.js
│   │   ├── admin.js, complaints.js
│   ├── seed/seed.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── notifications.js
│   │   └── billing.js
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   └── index.js
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   └── DashboardLayout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── public/ (Home, About, Services, HowItWorks, Pricing, Contact)
    │   │   ├── auth/ (Login, Signup)
    │   │   ├── user/ (Dashboard, BookService, Bookings, Attendance, Billing, Reviews, Notifications, Profile)
    │   │   ├── worker/ (Dashboard, Jobs, Schedule, Attendance, Earnings, Documents, Profile)
    │   │   ├── society/ (Dashboard, Residents, Workers, EntryLogs, Complaints)
    │   │   └── admin/ (Dashboard, Users, Workers, Bookings, Payments, Complaints, Analytics)
    │   ├── utils/navConfig.js
    │   └── App.jsx
    └── index.html
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and Install

```bash
# Backend
cd maid/backend
npm install

# Frontend
cd maid/frontend
npm install
```

### 2. Configure Backend Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/homehelp
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Configure Frontend Environment

```bash
# frontend/.env is already created
# Edit if needed:
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Sample Data

```bash
cd backend
node seed/seed.js
```

This creates:
- Super Admin: `admin@homehelp.in` / `Admin@123`
- Society Admin: `society@homehelp.in` / `Admin@123`
- User: `priya@example.com` / `User@123`
- Worker: `sunita.devi@worker.in` / `Worker@123`

### 5. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Workers | `GET /api/workers`, `GET /api/workers/:id` |
| Bookings | `POST /api/bookings`, `GET /api/bookings/my` |
| Attendance | `POST /api/attendance/checkin`, `GET /api/attendance/booking/:id` |
| Payments | `POST /api/payments/generate`, `GET /api/payments/my` |
| Ratings | `POST /api/ratings`, `GET /api/ratings/worker/:id` |
| Notifications | `GET /api/notifications`, `PUT /api/notifications/read-all` |
| Societies | `GET /api/societies`, `GET /api/societies/mine` |
| Admin | `GET /api/admin/dashboard`, `GET /api/admin/users` |

---

## User Roles

| Role | Dashboard Path | Description |
|------|---------------|-------------|
| `user` | `/user/dashboard` | Household member who books services |
| `worker` | `/worker/dashboard` | Domestic service provider |
| `society_admin` | `/society/dashboard` | Apartment/gated community manager |
| `super_admin` | `/admin/dashboard` | Full platform control |

---

## Deployment

### Backend → Render

1. Push backend to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Set environment variables in Render dashboard
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend → Vercel

1. Push frontend to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set `VITE_API_URL=https://your-backend.onrender.com/api`
4. Framework: Vite — Deploy!

### MongoDB → Atlas

1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Add connection string to backend `.env` as `MONGO_URI`
3. Whitelist `0.0.0.0/0` for Render IP or use Render static IPs

---

## Key Features

- ✅ **Recurring Monthly Subscriptions** — Fixed time slots per worker
- ✅ **Attendance Calendar** — Visual monthly calendar with present/absent/half-day
- ✅ **Smart Billing** — Auto-calculated invoices with absent deductions
- ✅ **Replacement System** — Temporary or permanent worker replacement
- ✅ **KYC & Verification** — Aadhaar, PAN, Police verification tracking
- ✅ **Society Integration** — Entry logs, worker approval/blocking
- ✅ **Role-Based Access** — 4 separate panels with JWT protection
- ✅ **Notifications** — Real-time platform events and alerts
- ✅ **Admin Analytics** — Revenue charts, booking breakdowns

---

## Environment Variables Reference

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

*Built with ❤️ for Indian families — HomeHelp+ Technologies Pvt. Ltd.*
