/**
 * Simple test to debug Securia API issues
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const adminCredentials = {
  email: 'admin@money1st.com',
  password: 'admin123'
};

const runDebugTest = async () => {
  try {
    console.log('🔑 Testing authentication...');
    
    // Login as admin
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, adminCredentials);
    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Test Securia status endpoint
    console.log('\n📊 Testing Securia status...');
    try {
      const statusResponse = await axios.get(`${BASE_URL}/api/securia/status`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      console.log('✅ Status response:', statusResponse.data);
    } catch (statusError) {
      console.log('❌ Status error:', statusError.response?.data || statusError.message);
    }
    
    // Test get consultants
    console.log('\n👥 Testing get consultants...');
    try {
      const consultantsResponse = await axios.get(`${BASE_URL}/api/securia/consultants`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      console.log('✅ Consultants response:', consultantsResponse.data);
    } catch (consultantsError) {
      console.log('❌ Consultants error:', consultantsError.response?.data || consultantsError.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

runDebugTest();
