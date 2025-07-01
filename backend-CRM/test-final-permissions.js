const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function testFinalPermissions() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const permissionsCollection = db.collection('pagepermissions');
    
    // Get all permissions
    const permissions = await permissionsCollection.find({}).toArray();
    console.log(`\n📊 Found ${permissions.length} page permissions:`);
    
    // Check each permission
    for (const permission of permissions) {
      console.log(`\n📄 Page: ${permission.pageName}`);
      console.log(`   Description: ${permission.description || 'N/A'}`);
      console.log(`   Role Permissions:`);
      
      if (permission.rolePermissions && typeof permission.rolePermissions === 'object') {
        for (const [role, hasAccess] of Object.entries(permission.rolePermissions)) {
          console.log(`     ${role}: ${hasAccess ? '✅' : '❌'}`);
        }
      } else {
        console.log(`     ❌ No role permissions or invalid format`);
      }
    }
    
    // Test specific roles
    const testRoles = ['Admin', 'Senior BMA', 'BMA', 'IBA'];
    console.log(`\n🔍 Testing role access for key roles:`);
    
    for (const role of testRoles) {
      console.log(`\n👤 ${role}:`);
      const accessList = [];
      const deniedList = [];
      
      for (const permission of permissions) {
        if (permission.rolePermissions && permission.rolePermissions[role]) {
          accessList.push(permission.pageName);
        } else {
          deniedList.push(permission.pageName);
        }
      }
      
      console.log(`   ✅ Has access to: ${accessList.join(', ') || 'None'}`);
      console.log(`   ❌ Denied access to: ${deniedList.join(', ') || 'None'}`);
    }
    
    // Check for any documents with "Sr. BMA" instead of "Senior BMA"
    console.log(`\n🔍 Checking for legacy "Sr. BMA" references...`);
    const legacyPermissions = await permissionsCollection.find({
      "rolePermissions.Sr. BMA": { $exists: true }
    }).toArray();
    
    if (legacyPermissions.length > 0) {
      console.log(`❌ Found ${legacyPermissions.length} documents with legacy "Sr. BMA"`);
      for (const perm of legacyPermissions) {
        console.log(`   - ${perm.pageName}`);
      }
    } else {
      console.log(`✅ No legacy "Sr. BMA" references found`);
    }
    
    console.log(`\n✨ Permission test completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error testing permissions:', error);
  } finally {
    await client.close();
  }
}

testFinalPermissions();
