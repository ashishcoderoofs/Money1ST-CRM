const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function migrateSrBMAToSeniorBMA() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // 1. Update Page Permissions collection
    console.log('\n🔄 Migrating Page Permissions...');
    const permissionsCollection = db.collection('pagepermissions');
    
    // Find all documents with 'Sr. BMA' in rolePermissions
    const permissionsWithSrBMA = await permissionsCollection.find({
      'rolePermissions.Sr. BMA': { $exists: true }
    }).toArray();
    
    console.log(`Found ${permissionsWithSrBMA.length} page permission documents with 'Sr. BMA'`);
    
    for (const doc of permissionsWithSrBMA) {
      console.log(`  Updating page: ${doc.pageName}`);
      
      // Get the current Sr. BMA value
      const srBMAValue = doc.rolePermissions['Sr. BMA'];
      
      // Remove 'Sr. BMA' and add 'Senior BMA'
      await permissionsCollection.updateOne(
        { _id: doc._id },
        {
          $unset: { 'rolePermissions.Sr. BMA': '' },
          $set: { 'rolePermissions.Senior BMA': srBMAValue }
        }
      );
      
      console.log(`    ✅ Migrated 'Sr. BMA': ${srBMAValue} to 'Senior BMA': ${srBMAValue}`);
    }
    
    // 2. Update Users collection
    console.log('\n🔄 Migrating User roles...');
    const usersCollection = db.collection('users');
    
    // Find all users with 'Sr. BMA' role
    const usersWithSrBMA = await usersCollection.find({
      role: 'Sr. BMA'
    }).toArray();
    
    console.log(`Found ${usersWithSrBMA.length} users with 'Sr. BMA' role`);
    
    if (usersWithSrBMA.length > 0) {
      const result = await usersCollection.updateMany(
        { role: 'Sr. BMA' },
        { $set: { role: 'Senior BMA' } }
      );
      
      console.log(`  ✅ Updated ${result.modifiedCount} user roles from 'Sr. BMA' to 'Senior BMA'`);
    }
    
    // 3. Verify the migration
    console.log('\n🔍 Verifying migration...');
    
    // Check page permissions
    const remainingPermissions = await permissionsCollection.find({
      'rolePermissions.Sr. BMA': { $exists: true }
    }).toArray();
    
    const newPermissions = await permissionsCollection.find({
      'rolePermissions.Senior BMA': { $exists: true }
    }).toArray();
    
    console.log(`Remaining 'Sr. BMA' in permissions: ${remainingPermissions.length}`);
    console.log(`New 'Senior BMA' in permissions: ${newPermissions.length}`);
    
    // Check users
    const remainingUsers = await usersCollection.find({
      role: 'Sr. BMA'
    }).toArray();
    
    const newUsers = await usersCollection.find({
      role: 'Senior BMA'
    }).toArray();
    
    console.log(`Remaining users with 'Sr. BMA' role: ${remainingUsers.length}`);
    console.log(`Users with 'Senior BMA' role: ${newUsers.length}`);
    
    console.log('\n✨ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await client.close();
  }
}

migrateSrBMAToSeniorBMA();
