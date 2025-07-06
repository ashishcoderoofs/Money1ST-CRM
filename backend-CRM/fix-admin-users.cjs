const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://coderoofs76:7k7wEsuMUwL9840Y@money1stcluster.ohqtn6u.mongodb.net/money1st?retryWrites=true&w=majority&appName=Money1stCluster';

async function fixAdminUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all users with role 'Admin' to have isAdmin = true
    const result = await mongoose.connection.db.collection('users').updateMany(
      { role: 'Admin' },
      { $set: { isAdmin: true } }
    );

    console.log(`Updated ${result.modifiedCount} admin users to have isAdmin = true`);

    // Update all users with role != 'Admin' to have isAdmin = false
    const nonAdminResult = await mongoose.connection.db.collection('users').updateMany(
      { role: { $ne: 'Admin' } },
      { $set: { isAdmin: false } }
    );

    console.log(`Updated ${nonAdminResult.modifiedCount} non-admin users to have isAdmin = false`);

    // Show current admin users
    const adminUsers = await mongoose.connection.db.collection('users').find(
      { role: 'Admin' },
      { projection: { firstName: 1, lastName: 1, email: 1, role: 1, isAdmin: 1 } }
    ).toArray();

    console.log('\nCurrent admin users:');
    adminUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}): role=${user.role}, isAdmin=${user.isAdmin}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    console.log('✓ Admin users fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing admin users:', error);
    process.exit(1);
  }
}

fixAdminUsers();
