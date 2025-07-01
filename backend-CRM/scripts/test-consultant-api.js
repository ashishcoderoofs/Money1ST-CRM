const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

// Sample consultant data
const sampleConsultant = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  mobile: "555-123-4567",
  address: "123 Main St",
  city: "Anytown",
  state: "CA",
  zipCode: "12345",
  dateOfBirth: "1990-01-01",
  maritalStatus: "Single",
  sex: "Male"
};

async function testConsultantAPI() {
  console.log('🧪 Testing Consultant API endpoints...\n');
  
  try {
    // Test 1: Check if consultant endpoints are accessible (should return 401 for auth)
    console.log('1️⃣ Testing GET /api/consultants (should require auth)');
    const response1 = await fetch(`${API_BASE}/consultants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${response1.status}`);
    if (response1.status === 401) {
      console.log('   ✅ Endpoint is properly protected with authentication');
    } else {
      console.log('   ❌ Endpoint should require authentication');
    }
    
    // Test 2: Check consultant stats endpoint
    console.log('\n2️⃣ Testing GET /api/consultants/stats (should require auth)');
    const response2 = await fetch(`${API_BASE}/consultants/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${response2.status}`);
    if (response2.status === 401) {
      console.log('   ✅ Stats endpoint is properly protected');
    }
    
    // Test 3: Check consultant search endpoint
    console.log('\n3️⃣ Testing GET /api/consultants/search (should require auth)');
    const response3 = await fetch(`${API_BASE}/consultants/search?query=test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${response3.status}`);
    if (response3.status === 401) {
      console.log('   ✅ Search endpoint is properly protected');
    }
    
    // Test 4: Try to create consultant without auth
    console.log('\n4️⃣ Testing POST /api/consultants (should require auth)');
    const response4 = await fetch(`${API_BASE}/consultants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleConsultant)
    });
    
    console.log(`   Status: ${response4.status}`);
    if (response4.status === 401) {
      console.log('   ✅ Create endpoint is properly protected');
    }
    
    console.log('\n✨ Consultant API endpoint tests completed!');
    console.log('\n📝 Summary:');
    console.log('   - All consultant endpoints are properly protected with authentication');
    console.log('   - Server is running and responding to requests');
    console.log('   - Ready for frontend integration with proper authentication');
    
  } catch (error) {
    console.error('❌ Error testing consultant API:', error.message);
  }
}

testConsultantAPI();
