const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testConsultantAPI() {
  try {
    // Try to get all consultants
    console.log('Testing API connection...');
    
    const response = await axios.get(`${API_BASE}/consultants`, {
      headers: {
        'Authorization': `Bearer fake-token` // This will likely fail but we can see the error
      }
    });
    
    console.log('Consultants found:', response.data);
    
  } catch (error) {
    console.log('Error (expected):', error.response?.status, error.response?.data?.error || error.message);
    
    // Let's test if the server is running
    try {
      const healthCheck = await axios.get(`${API_BASE}/health`);
      console.log('✅ Server is running');
    } catch (healthError) {
      console.log('❌ Server may not be running');
    }
  }
}

testConsultantAPI();
