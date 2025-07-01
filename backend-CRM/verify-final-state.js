const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function verifyFinalState() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // 1. Check Page Permissions
    console.log('\n📋 Page Permissions Status:');
    const permissionsCollection = db.collection('pagepermissions');
    const permissions = await permissionsCollection.find({}).toArray();
    
    console.log(`Total pages: ${permissions.length}`);
    
    let hasSrBMA = false;
    let hasSeniorBMA = false;
    
    for (const perm of permissions) {
      if (perm.rolePermissions['Sr. BMA'] !== undefined) {
        hasSrBMA = true;
      }
      if (perm.rolePermissions['Senior BMA'] !== undefined) {
        hasSeniorBMA = true;
      }
    }
    
    console.log(`✅ All pages have 'Senior BMA': ${hasSeniorBMA}`);
    console.log(`❌ Any pages with legacy 'Sr. BMA': ${hasSrBMA}`);
    
    // Show a sample permission document
    if (permissions.length > 0) {
      console.log('\n📄 Sample Permission Document:');
      console.log(`Page: ${permissions[0].pageName}`);
      console.log('Role Permissions:');
      for (const [role, access] of Object.entries(permissions[0].rolePermissions)) {
        console.log(`  ${role}: ${access ? '✅' : '❌'}`);
      }
    }
    
    // 2. Check Users
    console.log('\n👥 User Roles Status:');
    const usersCollection = db.collection('users');
    
    const srBMAUsers = await usersCollection.find({ role: 'Sr. BMA' }).toArray();
    const seniorBMAUsers = await usersCollection.find({ role: 'Senior BMA' }).toArray();
    
    console.log(`Users with legacy 'Sr. BMA' role: ${srBMAUsers.length}`);
    console.log(`Users with 'Senior BMA' role: ${seniorBMAUsers.length}`);
    
    if (seniorBMAUsers.length > 0) {
      console.log('Sample Senior BMA users:');
      for (let i = 0; i < Math.min(3, seniorBMAUsers.length); i++) {
        const user = seniorBMAUsers[i];
        console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
      }
    }
    
    // 3. Check for any MongoDB nested object issues
    console.log('\n🔍 MongoDB Structure Check:');
    const nestedObjectCheck = await permissionsCollection.find({
      'rolePermissions.Sr': { $exists: true }
    }).toArray();
    
    console.log(`Documents with nested 'Sr' object: ${nestedObjectCheck.length}`);
    
    if (nestedObjectCheck.length === 0) {
      console.log('✅ No MongoDB dot notation issues found');
    } else {
      console.log('❌ Found documents with nested object structure');
    }
    
    // 4. Summary
    console.log('\n📊 FINAL STATUS:');
    console.log(`✅ Page Permissions: ${hasSeniorBMA && !hasSrBMA ? 'FIXED' : 'NEEDS ATTENTION'}`);
    console.log(`✅ User Roles: ${seniorBMAUsers.length > 0 && srBMAUsers.length === 0 ? 'FIXED' : 'NEEDS ATTENTION'}`);
    console.log(`✅ MongoDB Structure: ${nestedObjectCheck.length === 0 ? 'CLEAN' : 'NEEDS ATTENTION'}`);
    
    if (hasSeniorBMA && !hasSrBMA && seniorBMAUsers.length > 0 && srBMAUsers.length === 0 && nestedObjectCheck.length === 0) {
      console.log('\n🎉 ALL ISSUES RESOLVED! The system is ready to use.');
    } else {
      console.log('\n⚠️  Some issues may still need attention.');
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error);
  } finally {
    await client.close();
  }
}

verifyFinalState();
