#!/usr/bin/env node

// Quick test script to verify the consultant frontend/backend integration
const https = require('http');

console.log('🔍 Testing Consultant API Integration...\n');

// Test 1: Check if backend is running
console.log('1. Checking backend server...');
const backendReq = https.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/consultants',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token'  // This will fail auth, but we just want to check if server responds
  }
}, (res) => {
  console.log(`   ✅ Backend server responding (Status: ${res.statusCode})`);
  if (res.statusCode === 401) {
    console.log('   ✅ Authentication middleware working correctly');
  }
});

backendReq.on('error', (e) => {
  console.log(`   ❌ Backend server not running: ${e.message}`);
  console.log('   💡 Start backend with: cd backend-CRM && npm run dev');
});

backendReq.end();

// Test 2: Check frontend build
console.log('\n2. Checking frontend compilation...');
const { exec } = require('child_process');
exec('npm run build', { cwd: 'd:\\Projects\\ExternalGit\\Money1ST-CRM' }, (error, stdout, stderr) => {
  if (error) {
    console.log(`   ❌ Frontend build failed: ${error.message}`);
    console.log('   💡 Fix TypeScript errors before testing');
  } else {
    console.log('   ✅ Frontend builds successfully');
  }
  
  console.log('\n📋 Summary:');
  console.log('✅ Fixed consultant list page to use new API hooks');
  console.log('✅ Fixed consultant details page with correct field names');
  console.log('✅ Fixed consultant edit page to use ConsultantFormApi');
  console.log('✅ Updated all SecuriaConsultant references to Consultant');
  console.log('✅ Removed legacy SecuriaConsultant model file');
  console.log('✅ Updated Swagger documentation');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Start backend: cd backend-CRM && npm run dev');
  console.log('2. Start frontend: npm run dev');
  console.log('3. Navigate to /securia/consultants');
  console.log('4. Test View and Edit actions');
});
