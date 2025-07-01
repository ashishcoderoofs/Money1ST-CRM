const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testApiEndpoints() {
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test 1: Get all page permissions (should work without auth for testing)
    console.log('1️⃣ Testing GET /api/admin/page-permissions');
    const response1 = await fetch(`${API_BASE}/admin/page-permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response1.status === 401) {
      console.log('   ✅ Endpoint is properly protected (401 Unauthorized)');
    } else {
      const data1 = await response1.json();
      console.log(`   Status: ${response1.status}`);
      console.log(`   Response: ${JSON.stringify(data1, null, 2)}`);
    }
    
    // Test 2: Check if server is running and responding
    console.log('\n2️⃣ Testing server health');
    const response2 = await fetch(`${API_BASE}/auth/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response2.ok) {
      console.log('   ✅ Server is responding');
    } else {
      console.log(`   ❌ Server returned status: ${response2.status}`);
    }
    
    console.log('\n✨ API endpoint tests completed!');
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error.message);
  }
}

testApiEndpoints();
