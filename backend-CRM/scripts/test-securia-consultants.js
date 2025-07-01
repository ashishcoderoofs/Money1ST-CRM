const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test admin token - you may need to adjust this
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZhNGY5ZmQxZGM1NjU3MjU5ZGU5NzQiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzM1MTM3NDA2LCJleHAiOjE3MzUxNDEwMDZ9.hGhsXf_3BuRhV8tJ8x7EyIZD8Y7wXDofRDKHIf-8qGI';

const headers = {
  'Authorization': `Bearer ${ADMIN_TOKEN}`,
  'Content-Type': 'application/json'
};

async function testSecuriaConsultantEndpoints() {
  console.log('🚀 Testing Securia Consultant Endpoints...\n');

  try {
    // Test 1: Get all consultants
    console.log('1. Testing GET /api/securia/consultants');
    const consultantsResponse = await axios.get(`${BASE_URL}/securia/consultants`, { headers });
    console.log('✅ GET consultants successful');
    console.log(`   Found ${consultantsResponse.data.data.length} consultants`);
    console.log(`   Pagination: ${consultantsResponse.data.pagination.total} total\n`);

    // Test 2: Create a new consultant using our comprehensive model
    console.log('2. Testing POST /api/securia/consultants');
    const newConsultant = {
      consultantId: 'TEST-CONSULTANT-001',
      entryDate: '2024-01-01',
      position: 'Senior Financial Consultant',
      status: 'Active',
      firstName: 'Test',
      lastName: 'SecuriaConsultant',
      email: 'test.securia@example.com',
      mobile: '555-0123',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TX',
      zipCode: '12345',
      dateOfBirth: '1990-01-01',
      maritalStatus: 'Single',
      sex: 'Male',
      comment: 'Test consultant created via Securia API'
    };

    const createResponse = await axios.post(`${BASE_URL}/securia/consultants`, newConsultant, { headers });
    console.log('✅ POST consultant successful');
    console.log(`   Created consultant: ${createResponse.data.data.firstName} ${createResponse.data.data.lastName}`);
    console.log(`   ID: ${createResponse.data.data._id}\n`);

    const consultantId = createResponse.data.data._id;

    // Test 3: Get consultant by ID
    console.log('3. Testing GET /api/securia/consultants/:id');
    const getConsultantResponse = await axios.get(`${BASE_URL}/securia/consultants/${consultantId}`, { headers });
    console.log('✅ GET consultant by ID successful');
    console.log(`   Consultant: ${getConsultantResponse.data.data.firstName} ${getConsultantResponse.data.data.lastName}`);
    console.log(`   Status: ${getConsultantResponse.data.data.status}\n`);

    // Test 4: Update consultant
    console.log('4. Testing PUT /api/securia/consultants/:id');
    const updateData = {
      position: 'Senior BMA',
      comment: 'Updated via Securia API test'
    };
    const updateResponse = await axios.put(`${BASE_URL}/securia/consultants/${consultantId}`, updateData, { headers });
    console.log('✅ PUT consultant successful');
    console.log(`   Updated position: ${updateResponse.data.data.position}\n`);

    // Test 5: Toggle status
    console.log('5. Testing PATCH /api/securia/consultants/:id/status');
    const statusResponse = await axios.patch(`${BASE_URL}/securia/consultants/${consultantId}/status`, {}, { headers });
    console.log('✅ PATCH consultant status successful');
    console.log(`   New status: ${statusResponse.data.data.status}\n`);

    // Test 6: Search consultants
    console.log('6. Testing GET /api/securia/consultants with search');
    const searchResponse = await axios.get(`${BASE_URL}/securia/consultants?search=Test&status=all`, { headers });
    console.log('✅ Search consultants successful');
    console.log(`   Found ${searchResponse.data.data.length} consultants matching "Test"\n`);

    // Test 7: Delete consultant
    console.log('7. Testing DELETE /api/securia/consultants/:id');
    await axios.delete(`${BASE_URL}/securia/consultants/${consultantId}`, { headers });
    console.log('✅ DELETE consultant successful\n');

    console.log('🎉 All Securia Consultant endpoint tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('💡 Please update the ADMIN_TOKEN in this test script');
    }
  }
}

// Run the tests
if (require.main === module) {
  testSecuriaConsultantEndpoints();
}

module.exports = { testSecuriaConsultantEndpoints };
