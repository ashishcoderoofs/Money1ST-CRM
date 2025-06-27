import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './src/models/User';
import logger from './utils/logger';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create first admin user
    const adminUser = new User({
      consultantId: 'ADMIN001',
      entryDate: new Date(),
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@money1st.com',
      password: 'admin123', // This will be hashed automatically
      role: 'Admin',
      status: 'Active'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@money1st.com');
    console.log('Password: admin123');
    console.log('Role: Admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdminUser();
