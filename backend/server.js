require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/workers',       require('./routes/workers'));
app.use('/api/bookings',      require('./routes/bookings'));
app.use('/api/attendance',    require('./routes/attendance'));
app.use('/api/payments',      require('./routes/payments'));
app.use('/api/ratings',       require('./routes/ratings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/societies',     require('./routes/societies'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/complaints',    require('./routes/complaints'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use(errorHandler);

// Start HTTP server first, then connect DB (server stays alive even if DB fails)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HomeHelp+ server running on port ${PORT} [${process.env.NODE_ENV}]`);
  connectDB();
});
