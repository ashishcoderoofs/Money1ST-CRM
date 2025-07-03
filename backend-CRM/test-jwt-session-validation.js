/**
 * Test JWT-Based Securia Session Validation
 * Tests the new approach that ties Securia session validity to JWT token issue time
 */

const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🔍 Testing JWT-Based Securia Session Validation');
console.log('===============================================');

// Simulate session store
const securiaSessionStore = new Map();

// Simulate the new validation logic
const hasValidSecuriaSession = (userId, jwtIssuedAt) => {
  for (const [sessionId, session] of securiaSessionStore.entries()) {
    if (session.userId === userId) {
      console.log(`Found session for user ${userId}:`);
      console.log(`- Session created: ${new Date(session.timestamp).toLocaleString()}`);
      
      if (jwtIssuedAt) {
        const jwtIssuedTimestamp = jwtIssuedAt * 1000;
        console.log(`- JWT issued: ${new Date(jwtIssuedTimestamp).toLocaleString()}`);
        console.log(`- Session after JWT: ${session.timestamp > jwtIssuedTimestamp ? 'YES' : 'NO'}`);
        
        // Session is only valid if it was created after the current JWT token
        return session.timestamp > jwtIssuedTimestamp;
      }
      return true;
    }
  }
  return false;
};

// Test scenario 1: Session created before JWT (should be invalid)
console.log('\n🧪 Test 1: Session created before JWT expiration/re-login');
console.log('========================================================');

const oldSessionTime = Date.now() - 5000; // 5 seconds ago
const newJwtTime = Math.floor(Date.now() / 1000); // Current time

securiaSessionStore.set('old_session', {
  userId: 'test_user',
  timestamp: oldSessionTime
});

const token1 = jwt.sign(
  { id: 'test_user' },
  process.env.JWT_SECRET || 'test_secret',
  { expiresIn: '10m' }
);

const decoded1 = jwt.decode(token1);
const isValid1 = hasValidSecuriaSession('test_user', decoded1.iat);

console.log(`Result: ${isValid1 ? '✅ Valid' : '❌ Invalid'} (Expected: Invalid)`);

// Test scenario 2: Session created after JWT (should be valid)
console.log('\n🧪 Test 2: Session created after JWT issue');
console.log('==========================================');

// Wait a moment then create a new session
setTimeout(() => {
  const newSessionTime = Date.now();
  securiaSessionStore.set('new_session', {
    userId: 'test_user2',
    timestamp: newSessionTime
  });

  const isValid2 = hasValidSecuriaSession('test_user2', decoded1.iat);
  console.log(`Result: ${isValid2 ? '✅ Valid' : '❌ Invalid'} (Expected: Valid)`);

  console.log('\n✅ New Logic Summary:');
  console.log('- Securia sessions are validated against JWT issue time');
  console.log('- Sessions created before current JWT are considered invalid');
  console.log('- Sessions created after current JWT are valid');
  console.log('- This ensures fresh authentication after JWT expiration');
  
  console.log('\n🔄 Expected Flow:');
  console.log('1. User logs in → JWT issued at time T1');
  console.log('2. User authenticates Securia → Session created at time T2 (T2 > T1)');
  console.log('3. JWT expires → User logs in again → New JWT issued at time T3');
  console.log('4. User accesses Securia → Session T2 < T3, so authentication required');
  console.log('5. User authenticates Securia → New session created at time T4 (T4 > T3)');
  
}, 100);
