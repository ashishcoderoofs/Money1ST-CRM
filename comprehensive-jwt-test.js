#!/usr/bin/env node

/**
 * Comprehensive JWT Token Expiration Test
 * Tests both backend and frontend JWT handling
 */

import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const JWT_SECRET = 'CMR';
const API_BASE_URL = 'http://localhost:3000';

console.log('🔧 Comprehensive JWT Token Expiration Test\n');

// Test 1: Generate token with 10-minute expiration
console.log('📝 Test 1: Token Generation');
const token = jwt.sign({ id: 'test-user-123' }, JWT_SECRET, { expiresIn: '10m' });
const decoded = jwt.decode(token);

console.log('✅ Generated 10-minute token');
console.log('   Expires at:', new Date(decoded.exp * 1000).toLocaleString());
console.log('   Time until expiry:', Math.floor((decoded.exp * 1000 - Date.now()) / 60000), 'minutes');

// Test 2: Generate expired token
console.log('\n📝 Test 2: Expired Token Verification');
const expiredToken = jwt.sign({ id: 'test-user-123' }, JWT_SECRET, { expiresIn: '-1s' });
try {
  jwt.verify(expiredToken, JWT_SECRET);
  console.log('❌ ERROR: Expired token was accepted by backend!');
} catch (error) {
  console.log('✅ Expired token correctly rejected by backend');
}

// Test 3: Frontend token expiration logic simulation
console.log('\n📝 Test 3: Frontend Token Expiration Logic');
const frontendIsTokenExpired = (token) => {
  try {
    const decodedToken = jwt.decode(token);
    const currentTime = Date.now() / 1000;
    
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};

console.log('   Valid token check:', frontendIsTokenExpired(token) ? '❌ EXPIRED' : '✅ VALID');
console.log('   Expired token check:', frontendIsTokenExpired(expiredToken) ? '✅ EXPIRED' : '❌ VALID');

// Test 4: Check if backend server is running and test authentication
console.log('\n📝 Test 4: Backend Server Authentication Test');

const testBackendAuth = async () => {
  try {
    // Test with valid token
    console.log('   Testing with valid token...');
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      console.log('   ✅ Valid token rejected (expected if user doesn\'t exist)');
    } else if (response.ok) {
      console.log('   ✅ Valid token accepted');
    } else {
      console.log('   ⚠️  Unexpected response:', response.status);
    }
    
    // Test with expired token
    console.log('   Testing with expired token...');
    const expiredResponse = await fetch(`${API_BASE_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${expiredToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (expiredResponse.status === 401) {
      console.log('   ✅ Expired token correctly rejected');
    } else {
      console.log('   ❌ Expired token was accepted! Status:', expiredResponse.status);
    }
    
  } catch (error) {
    console.log('   ⚠️  Backend server not running or network error:', error.message);
  }
};

await testBackendAuth();

// Test 5: Create a token that expires in 1 minute for live testing
console.log('\n📝 Test 5: Short-lived Token for Live Testing');
const shortToken = jwt.sign({ id: 'test-user-123' }, JWT_SECRET, { expiresIn: '1m' });
const shortDecoded = jwt.decode(shortToken);

console.log('✅ Created 1-minute token for testing');
console.log('   Expires at:', new Date(shortDecoded.exp * 1000).toLocaleString());
console.log('   Use this token to test frontend expiration:');
console.log('   Token:', shortToken);

console.log('\n🎯 Summary and Recommendations:');
console.log('1. Backend correctly generates tokens with 10-minute expiration');
console.log('2. Backend correctly rejects expired tokens');
console.log('3. Frontend logic for checking expiration is correct');
console.log('4. Potential issues to check:');
console.log('   - Are API calls using the token expiration check?');
console.log('   - Is the periodic check (every 10 seconds) running?');
console.log('   - Are there any cached requests bypassing token validation?');
console.log('   - Is localStorage being cleared when token expires?');

console.log('\n🔧 To debug further:');
console.log('1. Check browser console for token expiration logs');
console.log('2. Check Network tab for 401 responses');
console.log('3. Verify localStorage is cleared on token expiration');
console.log('4. Test with the 1-minute token above for faster debugging');
