/**
 * Test script for Securia API endpoints
 * This script tests all the new Securia endpoints to ensure they're working correctly
 */

const baseURL = 'http://localhost:3000/api';
let authToken = '';

async function makeRequest(endpoint, method = 'GET', body = null, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    ...headers
  };

  const options = {
    method,
    headers: defaultHeaders,
    ...(body && { body: JSON.stringify(body) })
  };

  try {
    const response = await fetch(`${baseURL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`\n${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error testing ${endpoint}:`, error.message);
    return { status: 500, error: error.message };
  }
}

async function testSecuriaEndpoints() {
  console.log('🧪 Testing Securia API Endpoints');
  console.log('='.repeat(50));

  // First, login to get auth token
  console.log('\n1. 🔐 Authentication Test');
  const loginResponse = await makeRequest('/auth/login', 'POST', {
    email: 'admin@money1st.com',
    password: 'admin123'
  });

  if (loginResponse.status === 200) {
    authToken = loginResponse.data.token;
    console.log('✅ Login successful, token acquired');
  } else {
    console.log('❌ Login failed, cannot continue with tests');
    return;
  }

  // Test Securia authentication endpoints
  console.log('\n2. 🔒 Securia Authentication Tests');
  await makeRequest('/securia/status');
  await makeRequest('/securia/reauth', 'POST', {
    email: 'admin@money1st.com',
    password: 'admin123'
  });

  // Test Consultant endpoints
  console.log('\n3. 👨‍💼 Consultant Management Tests');
  await makeRequest('/securia/consultants');
  
  const newConsultant = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    specialization: 'Financial Planning',
    experience: '5 years in wealth management',
    certifications: ['CFP', 'CFA'],
    status: 'active'
  };
  
  const consultantResponse = await makeRequest('/securia/consultants', 'POST', newConsultant);
  let consultantId = null;
  if (consultantResponse.status === 201) {
    consultantId = consultantResponse.data.data._id;
    console.log(`✅ Consultant created with ID: ${consultantId}`);
    
    // Test get consultant by ID
    await makeRequest(`/securia/consultants/${consultantId}`);
    
    // Test update consultant
    await makeRequest(`/securia/consultants/${consultantId}`, 'PUT', {
      ...newConsultant,
      experience: '6 years in wealth management'
    });
    
    // Test toggle consultant status
    await makeRequest(`/securia/consultants/${consultantId}/status`, 'PATCH');
  }

  // Test Client endpoints
  console.log('\n4. 👥 Client Management Tests');
  await makeRequest('/securia/clients');
  
  if (consultantId) {
    const newClient = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0456',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      },
      dateOfBirth: '1985-06-15',
      ssn: '123-45-6789',
      consultantId: consultantId,
      financialInfo: {
        annualIncome: 100000,
        netWorth: 500000,
        investmentGoals: 'Retirement planning and wealth preservation',
        riskTolerance: 'medium'
      },
      status: 'active'
    };
    
    const clientResponse = await makeRequest('/securia/clients', 'POST', newClient);
    if (clientResponse.status === 201) {
      const clientId = clientResponse.data.data._id;
      console.log(`✅ Client created with ID: ${clientId}`);
      
      // Test get client by ID
      await makeRequest(`/securia/clients/${clientId}`);
      
      // Test update client
      await makeRequest(`/securia/clients/${clientId}`, 'PUT', {
        ...newClient,
        financialInfo: {
          ...newClient.financialInfo,
          annualIncome: 110000
        }
      });
      
      // Test toggle client status
      await makeRequest(`/securia/clients/${clientId}/status`, 'PATCH');
    }
  }

  // Test Dashboard endpoints
  console.log('\n5. 📊 Dashboard & Analytics Tests');
  await makeRequest('/securia/dashboard/stats');
  await makeRequest('/securia/dashboard/charts?timeframe=month');

  // Test Audit endpoints
  console.log('\n6. 🔍 Security & Audit Tests');
  await makeRequest('/securia/audit/logs?limit=5');

  console.log('\n✅ All Securia endpoint tests completed!');
  console.log('='.repeat(50));
}

// Run the tests
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testSecuriaEndpoints().catch(console.error);
} else {
  // Browser environment
  testSecuriaEndpoints().catch(console.error);
}
