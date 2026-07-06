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
      { name: 'Ultra Radiant HD Waterproof Bridal Makeup Package', description: 'HD waterproof bridal makeup package with bridal lashes, lenses, hairstyle and draping.', category: 'Bridal Makeup', price: 18500, duration: 180 },
      { name: 'Signature Silk Bridal Makeup', description: 'Premium signature silk bridal package with advanced hairstyle, draping, premium lashes, lenses and bridal extras.', category: 'Bridal Makeup', price: 25000, duration: 180 },
      { name: 'Signature Silk Engagement / Shagun / Reception Makeup', description: 'Silk makeup for engagement, shagun or reception with premium products, hairdo, lashes, lenses and draping.', category: 'Bridal Makeup', price: 9500, duration: 60 },
      { name: 'Basic Party Makeup', description: 'Basic party makeup with simple hairstyling.', category: 'Party Makeup', price: 2500, duration: 150 },
      { name: 'HD Party Makeup', description: 'HD party makeup with lashes and advanced hairstyling.', category: 'HD Makeup', price: 3500, duration: 60 },
      { name: 'Signature Party Makeup', description: 'Signature party makeup with lashes, lenses and advanced hairstyling.', category: 'Party Makeup', price: 4500, duration: 90 },
      { name: 'Ultra Radiant Silk Party Makeup', description: 'Premium silk party makeup with luxury lashes, lenses, advanced hairstyling and draping.', category: 'Party Makeup', price: 6500, duration: 90 },
      { name: 'Temporary Nail Extensions', description: 'Temporary nail extensions with nail art included.', category: 'Nail Art', price: 1500, duration: 45 },
      { name: 'Acrylic Nail Extensions', description: 'Acrylic nail extensions with nail art included.', category: 'Nail Art', price: 2500, duration: 60 },
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
