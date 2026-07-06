import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Service from '../models/Service.js';
import { seedServiceCatalog } from '../data/serviceCatalog.js';

dotenv.config();

const backupServices = async () => {
  const services = await Service.find().lean();
  const backupDir = path.resolve('backups');
  fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `services-before-sync-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(services, null, 2));

  return { backupPath, count: services.length };
};

const syncServiceCatalog = async () => {
  await connectDB();

  const { backupPath, count } = await backupServices();
  const catalogNames = seedServiceCatalog.map((service) => service.name);

  let upserted = 0;
  for (const service of seedServiceCatalog) {
    await Service.findOneAndUpdate(
      { name: service.name },
      { ...service, isActive: true },
      {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        upsert: true,
      }
    );
    upserted += 1;
  }

  const deactivateResult = await Service.updateMany(
    { name: { $nin: catalogNames }, isActive: true },
    { $set: { isActive: false } }
  );

  console.log(`Backed up ${count} services to ${backupPath}`);
  console.log(`Synced ${upserted} catalog services`);
  console.log(`Deactivated ${deactivateResult.modifiedCount || 0} old services`);
};

syncServiceCatalog()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  });
