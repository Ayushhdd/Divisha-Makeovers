import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';
import AdminSettings from '../models/AdminSettings.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

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
    console.log('Admin user created');
  } else {
    console.log('Admin already exists');
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
    console.log('Default services seeded');
  }

  const settings = await AdminSettings.findOne();
  if (!settings) {
    await AdminSettings.create({});
    console.log('Admin settings initialized');
  }

  console.log('Seed completed');
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
