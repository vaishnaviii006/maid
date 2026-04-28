require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Society = require('../models/Society');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/homehelp';

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];
const categories = ['maid', 'cook', 'nanny', 'elder_care'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany(), Worker.deleteMany(), Society.deleteMany(),
    Booking.deleteMany(), Attendance.deleteMany(), Payment.deleteMany(),
    Rating.deleteMany(), Notification.deleteMany()
  ]);
  console.log('Cleared existing data');

  // Create super admin
  const superAdmin = await User.create({
    name: 'Super Admin', email: 'admin@homehelp.in', phone: '9000000001',
    password: 'Admin@123', role: 'super_admin', isActive: true, isVerified: true
  });

  // Create society admin
  const societyAdminUser = await User.create({
    name: 'Rajesh Sharma', email: 'society@homehelp.in', phone: '9000000002',
    password: 'Admin@123', role: 'society_admin', isActive: true, isVerified: true
  });

  // Create household users
  const householdUsers = await User.insertMany([
    { name: 'Priya Mehta', email: 'priya@example.com', phone: '9876543210', password: await bcrypt.hash('User@123', 10), role: 'user', isActive: true, isVerified: true, flatNumber: 'A-204', address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' } },
    { name: 'Arjun Kapoor', email: 'arjun@example.com', phone: '9876543211', password: await bcrypt.hash('User@123', 10), role: 'user', isActive: true, isVerified: true, flatNumber: 'B-101', address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' } },
    { name: 'Sneha Reddy', email: 'sneha@example.com', phone: '9876543212', password: await bcrypt.hash('User@123', 10), role: 'user', isActive: true, isVerified: true, flatNumber: 'C-302', address: { city: 'Bangalore', state: 'Karnataka', pincode: '560001' } },
    { name: 'Vikram Nair', email: 'vikram@example.com', phone: '9876543213', password: await bcrypt.hash('User@123', 10), role: 'user', isActive: true, isVerified: true, flatNumber: 'D-405', address: { city: 'Pune', state: 'Maharashtra', pincode: '411001' } },
  ]);

  // Create worker users and profiles
  const workerData = [
    { name: 'Sunita Devi', phone: '8800000001', category: 'maid', city: 'Mumbai', rate: 4500, rating: 4.7, exp: 5 },
    { name: 'Radha Kumari', phone: '8800000002', category: 'cook', city: 'Mumbai', rate: 6000, rating: 4.5, exp: 8 },
    { name: 'Geeta Patel', phone: '8800000003', category: 'nanny', city: 'Bangalore', rate: 7000, rating: 4.8, exp: 3 },
    { name: 'Mamta Singh', phone: '8800000004', category: 'elder_care', city: 'Pune', rate: 8000, rating: 4.6, exp: 6 },
    { name: 'Anita Sharma', phone: '8800000005', category: 'maid', city: 'Delhi', rate: 4000, rating: 4.4, exp: 4 },
    { name: 'Reena Gupta', phone: '8800000006', category: 'cook', city: 'Mumbai', rate: 5500, rating: 4.9, exp: 10 },
    { name: 'Pushpa Yadav', phone: '8800000007', category: 'maid', city: 'Hyderabad', rate: 4200, rating: 4.3, exp: 2 },
    { name: 'Kavita Joshi', phone: '8800000008', category: 'nanny', city: 'Mumbai', rate: 6500, rating: 4.7, exp: 5 },
  ];

  const createdWorkers = [];
  for (const w of workerData) {
    const userDoc = await User.create({
      name: w.name, email: `${w.name.toLowerCase().replace(' ', '.')}@worker.in`,
      phone: w.phone, password: await bcrypt.hash('Worker@123', 10),
      role: 'worker', isActive: true, isVerified: true,
      address: { city: w.city }
    });
    const workerDoc = await Worker.create({
      userId: userDoc._id, name: w.name, phone: w.phone,
      email: userDoc.email, category: w.category,
      experience: w.exp, monthlyRate: w.rate,
      rating: w.rating, totalRatings: Math.floor(Math.random() * 50 + 10),
      status: 'approved',
      bio: `Experienced ${w.category} with ${w.exp} years of professional service. Reliable, trustworthy and hardworking.`,
      skills: ['Cleaning', 'Cooking', 'Child care'].slice(0, 2),
      languages: ['Hindi', 'English'],
      availableDays: days,
      availability: { morning: true, afternoon: false, evening: false },
      serviceAreas: [w.city],
      address: { city: w.city, state: 'India' },
      kyc: {
        aadhaar: { url: 'https://example.com/aadhaar.pdf', verified: true },
        photo: { url: 'https://example.com/photo.jpg' }
      }
    });
    createdWorkers.push(workerDoc);
  }

  // Create society
  const society = await Society.create({
    name: 'Prestige Lakeside Habitat', registrationNumber: 'SOC-MH-2021-001',
    admin: societyAdminUser._id,
    address: { line1: 'Whitefield Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    totalFlats: 200, subscribedFlats: 87,
    approvedWorkers: createdWorkers.slice(0, 4).map(w => w._id),
    residents: householdUsers.map(u => u._id),
    contactEmail: 'society@prestige.in', contactPhone: '9000001234',
    isActive: true
  });

  // Create bookings
  const startDate = new Date('2024-01-01');
  const booking1 = await Booking.create({
    user: householdUsers[0]._id, worker: createdWorkers[0]._id, category: 'maid',
    timeSlot: { start: '07:00', end: '09:00' }, days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
    startDate, monthlyAmount: 4500, status: 'active',
    address: { line1: 'Flat A-204', city: 'Mumbai', flatNumber: 'A-204' }
  });
  const booking2 = await Booking.create({
    user: householdUsers[1]._id, worker: createdWorkers[1]._id, category: 'cook',
    timeSlot: { start: '08:00', end: '10:00' }, days: ['Mon','Tue','Wed','Thu','Fri'],
    startDate, monthlyAmount: 6000, status: 'active',
    address: { line1: 'Flat B-101', city: 'Mumbai', flatNumber: 'B-101' }
  });

  // Create attendance records for last 10 days
  const attendanceStatuses = ['present','present','present','present','absent','present','present','present','present','present'];
  for (let i = 0; i < 10; i++) {
    const date = new Date(); date.setDate(date.getDate() - i);
    await Attendance.create({
      booking: booking1._id, worker: createdWorkers[0]._id, user: householdUsers[0]._id,
      date, status: attendanceStatuses[i],
      checkIn: attendanceStatuses[i] === 'present' ? '07:05' : undefined,
      checkOut: attendanceStatuses[i] === 'present' ? '09:10' : undefined,
      markedBy: 'worker'
    });
  }

  // Create sample payment
  await Payment.create({
    user: householdUsers[0]._id, worker: createdWorkers[0]._id, booking: booking1._id,
    month: '2024-01',
    billingPeriod: { start: new Date('2024-01-01'), end: new Date('2024-01-31') },
    breakdown: { baseFee: 4500, workingDays: 26, presentDays: 24, absentDays: 2, absentDeduction: 346, overtimeAddition: 0 },
    totalAmount: 4154, status: 'paid',
    paymentMethod: 'upi', transactionId: 'TXN2024010001',
    paidAt: new Date('2024-02-05'), dueDate: new Date('2024-02-07'),
    invoiceNumber: 'HH-202401-1001'
  });

  // Create rating
  await Rating.create({
    user: householdUsers[0]._id, worker: createdWorkers[0]._id, booking: booking1._id,
    rating: 5, review: 'Sunita is extremely punctual and thorough. My house has never been cleaner!',
    categories: { punctuality: 5, quality: 5, behavior: 5 },
    month: '2024-01', isPublic: true
  });

  // Create notifications
  await Notification.create({
    recipient: householdUsers[0]._id, type: 'booking_confirmed',
    title: 'Booking Confirmed!', isRead: false,
    message: 'Your maid booking with Sunita Devi is confirmed starting 1 Jan 2024.'
  });
  await Notification.create({
    recipient: householdUsers[0]._id, type: 'payment_due',
    title: 'Invoice Ready', isRead: true, readAt: new Date(),
    message: 'Your January invoice of ₹4,154 is ready. Due by 7 Feb 2024.'
  });

  console.log('✅ Seed data created successfully!');
  console.log('---');
  console.log('Login credentials:');
  console.log('Super Admin → admin@homehelp.in / Admin@123');
  console.log('Society Admin → society@homehelp.in / Admin@123');
  console.log('User → priya@example.com / User@123');
  console.log('Worker → sunita.devi@worker.in / Worker@123');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
