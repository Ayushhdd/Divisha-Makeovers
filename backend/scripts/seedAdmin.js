import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';
import AdminSettings from '../models/AdminSettings.js';
import connectDB from '../config/db.js';
import { seedServiceCatalog } from '../data/serviceCatalog.js';

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
    await Service.insertMany(seedServiceCatalog);
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
