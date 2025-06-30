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

verifySwaggerRegistration();
