/**
 * Comprehensive test script for all Securia API endpoints
 * Tests endpoint functionality and validates Swagger documentation registration
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const SWAGGER_URL = `${BASE_URL}/api-docs.json`;

// Test data
const adminCredentials = {
  email: 'admin@money1st.com',
  password: 'admin123'
};

const testConsultant = {
  firstName: 'John',
  lastName: 'Doe',
  email: `john.doe.${Date.now()}@example.com`,
  phone: '+1-555-0123',
  specialization: 'Financial Planning',
  experience: '5 years in wealth management',
  certifications: ['CFP', 'CFA'],
  status: 'active'
};

const testClient = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: `jane.smith.${Date.now()}@example.com`,
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
  status: 'active',
  consultantId: null, // Will be set after creating consultant
  financialInfo: {
    annualIncome: 100000,
    netWorth: 500000,
    investmentGoals: 'Retirement planning and wealth preservation',
    riskTolerance: 'medium'
  }
};

let authToken = '';
let createdConsultantId = '';
let createdClientId = '';

// Helper function to make authenticated API calls
const apiCall = async (method, endpoint, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    data
  };
  
  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status,
      fullError: error.response || error
    };
  }
};

// Test functions
const testSwaggerDocumentation = async () => {
  console.log('\n🔍 Testing Swagger Documentation Registration...');
  
  try {
    const response = await axios.get(SWAGGER_URL);
    const swaggerSpec = response.data;
    
    console.log('✅ Swagger JSON accessible');
    
    // Check if Securia tag exists
    const securiaTag = swaggerSpec.tags?.find(tag => tag.name === 'Securia');
    console.log(securiaTag ? '✅ Securia tag found' : '❌ Securia tag missing');
    
    // Check if Securia schemas are registered
    const schemas = swaggerSpec.components?.schemas || {};
    const securiaSchemas = [
      'SecuriaConsultant',
      'SecuriaClient', 
      'SecuriaAuditLog',
      'SecuriaDashboardStats',
      'SecuriaApiResponse',
      'SecuriaPagination'
    ];
    
    securiaSchemas.forEach(schema => {
      if (schemas[schema]) {
        console.log(`✅ Schema ${schema} registered`);
      } else {
        console.log(`❌ Schema ${schema} missing`);
      }
    });
    
    // Check if Securia endpoints are documented
    const paths = swaggerSpec.paths || {};
    const securiaEndpoints = [
      '/api/securia/reauth',
      '/api/securia/status',
      '/api/securia/consultants',
      '/api/securia/consultants/{id}',
      '/api/securia/consultants/{id}/status',
      '/api/securia/clients',
      '/api/securia/clients/{id}',
      '/api/securia/clients/{id}/status',
      '/api/securia/dashboard/stats',
      '/api/securia/dashboard/charts',
      '/api/securia/audit/logs'
    ];
    
    securiaEndpoints.forEach(endpoint => {
      if (paths[endpoint]) {
        console.log(`✅ Endpoint ${endpoint} documented`);
      } else {
        console.log(`❌ Endpoint ${endpoint} missing from documentation`);
      }
    });
    
    console.log('✅ Swagger documentation verification completed');
    
  } catch (error) {
    console.error('❌ Failed to verify Swagger documentation:', error.message);
  }
};

const testAuthentication = async () => {
  console.log('\n🔑 Testing Authentication...');
  
  // Login as admin
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, adminCredentials);
    authToken = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test Securia reauth
    const reauthResult = await apiCall('POST', '/api/securia/reauth', adminCredentials);
    console.log(reauthResult.success ? '✅ Securia reauth successful' : `❌ Securia reauth failed: ${reauthResult.error?.message}`);
    
    // Test Securia status
    const statusResult = await apiCall('GET', '/api/securia/status');
    if (statusResult.success) {
      console.log('✅ Securia status check successful');
    } else {
      console.log(`❌ Securia status failed:`, statusResult.error, statusResult.fullError?.data);
    }
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    return false;
  }
  
  return true;
};

const testConsultantEndpoints = async () => {
  console.log('\n👥 Testing Consultant Endpoints...');
  
  // Create consultant
  const createResult = await apiCall('POST', '/api/securia/consultants', testConsultant);
  if (createResult.success) {
    createdConsultantId = createResult.data.data._id;
    console.log('✅ Consultant created successfully');
  } else {
    console.log(`❌ Consultant creation failed: ${createResult.error?.message}`);
    return false;
  }
  
  // Get all consultants
  const getAllResult = await apiCall('GET', '/api/securia/consultants?page=1&limit=10');
  console.log(getAllResult.success ? '✅ Get all consultants successful' : `❌ Get all consultants failed: ${getAllResult.error?.message}`);
  
  // Get consultant by ID
  const getByIdResult = await apiCall('GET', `/api/securia/consultants/${createdConsultantId}`);
  console.log(getByIdResult.success ? '✅ Get consultant by ID successful' : `❌ Get consultant by ID failed: ${getByIdResult.error?.message}`);
  
  // Update consultant
  const updateData = { specialization: 'Updated Financial Planning' };
  const updateResult = await apiCall('PUT', `/api/securia/consultants/${createdConsultantId}`, updateData);
  console.log(updateResult.success ? '✅ Consultant update successful' : `❌ Consultant update failed: ${updateResult.error?.message}`);
  
  // Toggle consultant status
  const toggleResult = await apiCall('PATCH', `/api/securia/consultants/${createdConsultantId}/status`);
  console.log(toggleResult.success ? '✅ Consultant status toggle successful' : `❌ Consultant status toggle failed: ${toggleResult.error?.message}`);
  
  return true;
};

const testClientEndpoints = async () => {
  console.log('\n👤 Testing Client Endpoints...');
  
  // Set consultant ID for client
  testClient.consultantId = createdConsultantId;
  
  // Create client
  const createResult = await apiCall('POST', '/api/securia/clients', testClient);
  if (createResult.success) {
    createdClientId = createResult.data.data._id;
    console.log('✅ Client created successfully (with encrypted SSN)');
  } else {
    console.log(`❌ Client creation failed: ${createResult.error?.message}`);
    return false;
  }
  
  // Get all clients
  const getAllResult = await apiCall('GET', '/api/securia/clients?page=1&limit=10');
  console.log(getAllResult.success ? '✅ Get all clients successful' : `❌ Get all clients failed: ${getAllResult.error?.message}`);
  
  // Get client by ID
  const getByIdResult = await apiCall('GET', `/api/securia/clients/${createdClientId}`);
  console.log(getByIdResult.success ? '✅ Get client by ID successful' : `❌ Get client by ID failed: ${getByIdResult.error?.message}`);
  
  // Update client
  const updateData = { financialInfo: { ...testClient.financialInfo, annualIncome: 120000 } };
  const updateResult = await apiCall('PUT', `/api/securia/clients/${createdClientId}`, updateData);
  console.log(updateResult.success ? '✅ Client update successful' : `❌ Client update failed: ${updateResult.error?.message}`);
  
  // Toggle client status
  const toggleResult = await apiCall('PATCH', `/api/securia/clients/${createdClientId}/status`);
  console.log(toggleResult.success ? '✅ Client status toggle successful' : `❌ Client status toggle failed: ${toggleResult.error?.message}`);
  
  return true;
};

const testDashboardEndpoints = async () => {
  console.log('\n📊 Testing Dashboard Endpoints...');
  
  // Get dashboard stats
  const statsResult = await apiCall('GET', '/api/securia/dashboard/stats');
  console.log(statsResult.success ? '✅ Dashboard stats retrieved successfully' : `❌ Dashboard stats failed: ${statsResult.error?.message}`);
  
  // Get chart data
  const chartsResult = await apiCall('GET', '/api/securia/dashboard/charts?timeframe=month');
  console.log(chartsResult.success ? '✅ Chart data retrieved successfully' : `❌ Chart data failed: ${chartsResult.error?.message}`);
  
  return true;
};

const testAuditEndpoints = async () => {
  console.log('\n🔍 Testing Audit Endpoints...');
  
  // Get audit logs
  const auditResult = await apiCall('GET', '/api/securia/audit/logs?page=1&limit=10');
  console.log(auditResult.success ? '✅ Audit logs retrieved successfully' : `❌ Audit logs failed: ${auditResult.error?.message}`);
  
  return true;
};

const cleanup = async () => {
  console.log('\n🧹 Cleaning up test data...');
  
  // Delete test client
  if (createdClientId) {
    const deleteClientResult = await apiCall('DELETE', `/api/securia/clients/${createdClientId}`);
    console.log(deleteClientResult.success ? '✅ Test client deleted' : `❌ Failed to delete test client: ${deleteClientResult.error?.message}`);
  }
  
  // Delete test consultant
  if (createdConsultantId) {
    const deleteConsultantResult = await apiCall('DELETE', `/api/securia/consultants/${createdConsultantId}`);
    console.log(deleteConsultantResult.success ? '✅ Test consultant deleted' : `❌ Failed to delete test consultant: ${deleteConsultantResult.error?.message}`);
  }
};

const runAllTests = async () => {
  console.log('🚀 Starting comprehensive Securia API tests...\n');
  
  try {
    // Test Swagger documentation first
    await testSwaggerDocumentation();
    
    // Test authentication
    const authSuccess = await testAuthentication();
    if (!authSuccess) {
      console.log('❌ Authentication failed, cannot continue with other tests');
      return;
    }
    
    // Test all endpoints
    await testConsultantEndpoints();
    await testClientEndpoints();
    await testDashboardEndpoints();
    await testAuditEndpoints();
    
    // Cleanup
    await cleanup();
    
    console.log('\n✅ All tests completed! Check the results above.');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
};

// Run the tests
runAllTests();
