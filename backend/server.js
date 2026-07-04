import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { startReminderJob } from './utils/reminderJob.js';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import User from './models/User.js';
import Service from './models/Service.js';
import AdminSettings from './models/AdminSettings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
startReminderJob();

// Auto-seed admin user on startup
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        fullName: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@divishamakeovers.com',
        mobile: '9999999999',
        password: process.env.ADMIN_PASSWORD || 'ChangeMe@123',
        role: 'admin',
        address: {
          line1: 'Admin Office',
          district: 'Default',
          state: 'Default',
          postalCode: '000000',
        },
      });
      console.log('✓ Admin created successfully');
      console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@divishamakeovers.com'}`);
      console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'ChangeMe@123'}`);
    } else {
      console.log('✓ Admin already exists');
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const defaultServices = [
        { name: 'Bridal Makeup', description: 'Complete bridal makeup with premium products', category: 'Bridal Makeup', price: 15000, duration: 180 },
        { name: 'Party Makeup', description: 'Glamorous party makeup look', category: 'Party Makeup', price: 3500, duration: 90 },
        { name: 'HD Makeup', description: 'High-definition camera-ready makeup', category: 'HD Makeup', price: 5000, duration: 120 },
        { name: 'Hair Styling', description: 'Professional hair styling for any occasion', category: 'Hair Styling', price: 2500, duration: 60 },
        { name: 'Pre-Wedding Makeup', description: 'Makeup for pre-wedding shoots and events', category: 'Pre-Wedding Makeup', price: 8000, duration: 150 },
        { name: 'Nail Art', description: 'Creative nail art and manicure', category: 'Nail Art', price: 1500, duration: 45 },
      ];
      await Service.insertMany(defaultServices);
      console.log('✓ Default services seeded');
    }

    const settings = await AdminSettings.findOne();
    if (!settings) {
      await AdminSettings.create({});
      console.log('✓ Admin settings initialized');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

seedAdmin();

const app = express();
const localOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
const configuredOrigins = (
  process.env.CLIENT_URL || 'https://divisha-makeovers-zeta.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...configuredOrigins, ...localOrigins]));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, '');
      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Divisha Makeovers API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
