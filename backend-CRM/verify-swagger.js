/**
 * Final verification script for Securia API Swagger registration
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const SWAGGER_URL = `${BASE_URL}/api-docs.json`;

const verifySwaggerRegistration = async () => {
  console.log('🔍 Verifying Securia API Swagger Registration...\n');
  
  try {
    // Get Swagger specification
    const response = await axios.get(SWAGGER_URL);
    const swaggerSpec = response.data;
    
    console.log('✅ Swagger specification accessible');
    console.log(`📊 API Title: ${swaggerSpec.info.title}`);
    console.log(`📋 API Version: ${swaggerSpec.info.version}`);
    
    // Test API connectivity and get actual data
    await testApiData();
    
    // Verify Securia endpoints are documented
    const paths = swaggerSpec.paths || {};
    const securiaEndpoints = Object.keys(paths).filter(path => path.startsWith('/api/securia'));
    
    console.log(`\n🔗 Securia Endpoints Registered: ${securiaEndpoints.length}`);
    securiaEndpoints.forEach(endpoint => {
      const methods = Object.keys(paths[endpoint]);
      console.log(`  ✅ ${endpoint} [${methods.join(', ').toUpperCase()}]`);
    });
    
    // Verify schemas are registered
    const schemas = swaggerSpec.components?.schemas || {};
    const securiaSchemas = Object.keys(schemas).filter(schema => schema.startsWith('Securia'));
    
    console.log(`\n📋 Securia Schemas Registered: ${securiaSchemas.length}`);
    securiaSchemas.forEach(schema => {
      console.log(`  ✅ ${schema}`);
    });
    
    // Verify security configuration
    const security = swaggerSpec.components?.securitySchemes || {};
    const hasBearer = security.bearerAuth && security.bearerAuth.type === 'http';
    console.log(`\n🔐 Bearer Authentication: ${hasBearer ? '✅ Configured' : '❌ Missing'}`);
    
    // Summary
    console.log('\n📊 REGISTRATION SUMMARY:');
    console.log(`  • Total Securia Endpoints: ${securiaEndpoints.length}`);
    console.log(`  • Total Securia Schemas: ${securiaSchemas.length}`);
    console.log(`  • Authentication: ${hasBearer ? 'Configured' : 'Missing'}`);
    console.log(`  • Swagger UI: http://localhost:3000/api-docs`);
    console.log(`  • JSON Spec: http://localhost:3000/api-docs.json`);
    
    if (securiaEndpoints.length >= 11 && securiaSchemas.length >= 6) {
      console.log('\n🎉 SUCCESS: All Securia API endpoints are properly registered in Swagger!');
    } else {
      console.log('\n⚠️  WARNING: Some endpoints or schemas may be missing.');
    }
    
  } catch (error) {
    console.error('❌ Failed to verify Swagger registration:', error.message);
  }
};

const testApiData = async () => {
  try {
    console.log('\n🔑 Testing API Authentication and Data...');
    
    // Login first
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@money1st.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Authentication successful');
    
    const authHeader = { 'Authorization': `Bearer ${token}` };
    
    // Get consultants data
    try {
      const consultantsResponse = await axios.get(`${BASE_URL}/api/securia/consultants?limit=5`, {
        headers: authHeader
      });
      
      const consultants = consultantsResponse.data.data || [];
      console.log(`\n👥 Consultants Data (${consultants.length} found):`);
      
      if (consultants.length > 0) {
        consultants.slice(0, 3).forEach((consultant, index) => {
          console.log(`  ${index + 1}. ${consultant.firstName} ${consultant.lastName}`);
          console.log(`     📧 ${consultant.email}`);
          console.log(`     🏢 ${consultant.specialization}`);
          console.log(`     📊 Status: ${consultant.status}`);
          console.log(`     📅 Created: ${new Date(consultant.createdAt).toLocaleDateString()}`);
          console.log('');
        });
      } else {
        console.log('  No consultants found');
      }
    } catch (error) {
      console.log(`❌ Failed to fetch consultants: ${error.message}`);
    }
    
    // Get clients data
    try {
      const clientsResponse = await axios.get(`${BASE_URL}/api/securia/clients?limit=5`, {
        headers: authHeader
      });
      
      const clients = clientsResponse.data.data || [];
      console.log(`👤 Clients Data (${clients.length} found):`);
      
      if (clients.length > 0) {
        clients.slice(0, 3).forEach((client, index) => {
          console.log(`  ${index + 1}. ${client.firstName} ${client.lastName}`);
          console.log(`     📧 ${client.email}`);
          console.log(`     📱 ${client.phone}`);
          console.log(`     🏠 ${client.address?.city}, ${client.address?.state}`);
          console.log(`     💰 Annual Income: $${client.financialInfo?.annualIncome?.toLocaleString()}`);
          console.log(`     📊 Risk Tolerance: ${client.financialInfo?.riskTolerance}`);
          console.log(`     📊 Status: ${client.status}`);
          console.log(`     🔒 SSN: ${client.ssn ? '[ENCRYPTED]' : '[NOT SET]'}`);
          console.log(`     📅 Created: ${new Date(client.createdAt).toLocaleDateString()}`);
          console.log('');
        });
      } else {
        console.log('  No clients found');
      }
    } catch (error) {
      console.log(`❌ Failed to fetch clients: ${error.message}`);
    }
    
    // Get dashboard stats
    try {
      const statsResponse = await axios.get(`${BASE_URL}/api/securia/dashboard/stats`, {
        headers: authHeader
      });
      
      const stats = statsResponse.data.data;
      console.log('📊 Dashboard Statistics:');
      console.log(`  • Total Consultants: ${stats.totalConsultants}`);
      console.log(`  • Active Consultants: ${stats.activeConsultants}`);
      console.log(`  • Total Clients: ${stats.totalClients}`);
      console.log(`  • Active Clients: ${stats.activeClients}`);
      console.log(`  • Total Revenue: $${stats.totalRevenue?.toLocaleString()}`);
      console.log(`  • Monthly Growth: ${stats.monthlyGrowth}%`);
      console.log('');
    } catch (error) {
      console.log(`❌ Failed to fetch dashboard stats: ${error.message}`);
    }
    
    // Get recent audit logs
    try {
      const auditResponse = await axios.get(`${BASE_URL}/api/securia/audit/logs?limit=3`, {
        headers: authHeader
      });
      
      const logs = auditResponse.data.data || [];
      console.log(`🔍 Recent Audit Logs (${logs.length} shown):`);
      
      if (logs.length > 0) {
        logs.forEach((log, index) => {
          console.log(`  ${index + 1}. ${log.action} on ${log.resource}`);
          console.log(`     👤 User: ${log.userEmail}`);
          console.log(`     🌐 IP: ${log.ipAddress}`);
          console.log(`     📅 Time: ${new Date(log.timestamp).toLocaleString()}`);
          console.log('');
        });
      } else {
        console.log('  No audit logs found');
      }
    } catch (error) {
      console.log(`❌ Failed to fetch audit logs: ${error.message}`);
    }
    
  } catch (error) {
    console.log(`❌ API testing failed: ${error.message}`);
  }
};

verifySwaggerRegistration();
