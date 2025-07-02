#!/usr/bin/env node

/**
 * Debug Field Builder Access Issue
 * This test helps debug why Field Builder is getting access denied
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = 'CMR';

console.log('🔧 Debug Field Builder Access Issue\n');

// Create a test Field Builder user
const fieldBuilderUser = {
  id: 'test-field-builder',
  role: 'Field Builder',
  email: 'fieldbuilder@test.com',
  status: 'Active'
};

const token = jwt.sign(fieldBuilderUser, JWT_SECRET, { expiresIn: '1h' });

console.log('✅ Created Field Builder test token');
console.log('   Role:', fieldBuilderUser.role);
console.log('   Status:', fieldBuilderUser.status);

const userData = JSON.stringify({
  id: fieldBuilderUser.id,
  role: fieldBuilderUser.role,
  email: fieldBuilderUser.email,
  firstName: 'Test',
  lastName: 'FieldBuilder',
  status: fieldBuilderUser.status
});

console.log('\n🔧 To test Field Builder access in browser:');
console.log('1. Open browser console');
console.log('2. Clear existing auth:');
console.log('   localStorage.removeItem("auth_token");');
console.log('   localStorage.removeItem("auth_user");');
console.log('3. Set Field Builder token:');
console.log(`   localStorage.setItem("auth_token", "${token}");`);
console.log(`   localStorage.setItem("auth_user", '${userData}');`);
console.log('4. Refresh the page');
console.log('5. Navigate to /dashboard');
console.log('6. Check browser console for debug logs');

console.log('\n🔍 Expected behavior:');
console.log('- Field Builder should have access to Dashboard');
console.log('- useUserPageAccess should return true for Dashboard');
console.log('- Check console logs for role and permission checks');

console.log('\n📋 Debug checklist:');
console.log('1. Verify user.status is "Active" not "active"');
console.log('2. Check if API /api/admin/permissions/check works');
console.log('3. Verify default permissions for Field Builder');
console.log('4. Check if permissions are populated in database');
console.log('5. Look for any API errors in Network tab');

console.log('\n⚠️ Common issues:');
console.log('- User status case sensitivity (Active vs active)');
console.log('- Missing permissions in database');
console.log('- API endpoint returning errors');
console.log('- Role name mismatch ("Field Builder" vs "field_builder")');
console.log('- Page name mismatch ("Dashboard" vs "dashboard")');
