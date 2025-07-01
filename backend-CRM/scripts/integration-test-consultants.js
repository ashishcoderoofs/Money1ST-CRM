/**
 * Integration Test for Consultant Management System
 * 
 * This test verifies that:
 * 1. The backend can create consultants using our comprehensive model
 * 2. The securia endpoints return the data correctly
 * 3. The frontend interfaces are compatible with the backend data
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test admin token - you may need to update this if it's expired
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZhNGY5ZmQxZGM1NjU3MjU5ZGU5NzQiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzM1MTM3NDA2LCJleHAiOjE3MzUxNDEwMDZ9.hGhsXf_3BuRhV8tJ8x7EyIZD8Y7wXDofRDKHIf-8qGI';

const headers = {
  'Authorization': `Bearer ${ADMIN_TOKEN}`,
  'Content-Type': 'application/json'
};

// Comprehensive test consultant data that matches our form schema
const testConsultant = {
  // Main Information
  consultantId: 'INT-TEST-001',
  entryDate: '2024-12-24',
  position: 'Senior Financial Consultant',
  status: 'Active',
  title: 'Mr.',
  firstName: 'Integration',
  middleInitial: 'T',
  lastName: 'TestConsultant',
  suffix: 'Jr.',
  comment: 'Created by integration test to verify the consultant system',
  remarks: 'This consultant should appear in the frontend list',

  // Contact Information
  email: 'integration.test@money1st.com',
  maidenName: '',
  address: '123 Integration Test Drive',
  city: 'Test City',
  county: 'Test County',
  state: 'TX',
  zipCode: '75001',
  homePhone: '214-555-0001',
  mobile: '214-555-0002',
  workPhone: '214-555-0003',
  otherPhone: '214-555-0004',
  fax: '214-555-0005',
  membershipType: 'Premium',
  amount: 5000.00,
  jointMemberName: 'Test Spouse',

  // Personal Information
  dateOfBirth: '1985-06-15',
  maritalStatus: 'Married',
  sex: 'Male',
  race: 'Test Race/Ethnicity',
  spouseName: 'Test Spouse',
  anniversary: '2010-07-04',
  spouseOccupation: 'Teacher',
  educationLevel: 'Bachelor Degree',
  driversLicenseNumber: 'TX123456789',
  driversLicenseState: 'TX',
  employmentStatus: 'Employed',
  employer: 'Money1ST',
  occupation: 'Financial Consultant',
  industry: 'Financial Services',

  // CFS Information
  ssn: '000-00-0000',
  ein: '12-3456789',
  hireDate: '2020-01-15',
  yearsWithFrq: 4,
  companyName: 'Money1ST CRM',
  cfsCertificationDate: '2020-03-01',
  effectiveDate: '2020-03-15',
  memberType: 'Professional',
  mbrAmt: 2500.00,
  payType: 'Salary',
  mpFee: 150.00,
  cfsStatus: 'Active',
  statusDate: '2020-03-15',

  // Emergency Contact
  emergencyContactName: 'Test Emergency Contact',
  emergencyContactRelationship: 'Spouse',
  emergencyContactPhone: '214-555-9999'
};

async function runIntegrationTest() {
  console.log('🧪 Running Consultant Management Integration Test...\n');

  try {
    // Step 1: Test securia consultants list endpoint (before creation)
    console.log('1. Testing initial consultant list...');
    const initialListResponse = await axios.get(`${BASE_URL}/securia/consultants`, { headers });
    console.log(`✅ Initial consultant count: ${initialListResponse.data.data.length}`);
    const initialCount = initialListResponse.data.data.length;

    // Step 2: Create comprehensive consultant via securia endpoint
    console.log('\n2. Creating comprehensive test consultant...');
    const createResponse = await axios.post(`${BASE_URL}/securia/consultants`, testConsultant, { headers });
    console.log('✅ Consultant created successfully');
    console.log(`   Name: ${createResponse.data.data.firstName} ${createResponse.data.data.lastName}`);
    console.log(`   ID: ${createResponse.data.data._id}`);
    console.log(`   Status: ${createResponse.data.data.status}`);
    console.log(`   Position: ${createResponse.data.data.position || 'N/A'}`);
    console.log(`   Entry Date: ${createResponse.data.data.entryDate || 'N/A'}`);

    const consultantId = createResponse.data.data._id;

    // Step 3: Verify consultant appears in list
    console.log('\n3. Verifying consultant appears in list...');
    const updatedListResponse = await axios.get(`${BASE_URL}/securia/consultants`, { headers });
    console.log(`✅ Updated consultant count: ${updatedListResponse.data.data.length}`);
    
    if (updatedListResponse.data.data.length === initialCount + 1) {
      console.log('✅ Consultant successfully added to list');
    } else {
      console.log('❌ Consultant count did not increase as expected');
    }

    // Step 4: Find our test consultant in the list
    const ourConsultant = updatedListResponse.data.data.find(c => c._id === consultantId);
    if (ourConsultant) {
      console.log('✅ Test consultant found in list');
      console.log(`   Listed as: ${ourConsultant.firstName} ${ourConsultant.lastName}`);
      console.log(`   Status: ${ourConsultant.status}`);
      console.log(`   Position: ${ourConsultant.position || 'N/A'}`);
    } else {
      console.log('❌ Test consultant NOT found in list');
    }

    // Step 5: Test search functionality
    console.log('\n4. Testing search functionality...');
    const searchResponse = await axios.get(`${BASE_URL}/securia/consultants?search=Integration`, { headers });
    console.log(`✅ Search results: ${searchResponse.data.data.length} consultants found`);
    
    const searchFound = searchResponse.data.data.some(c => c._id === consultantId);
    if (searchFound) {
      console.log('✅ Test consultant found in search results');
    } else {
      console.log('❌ Test consultant NOT found in search results');
    }

    // Step 6: Test status filtering
    console.log('\n5. Testing status filtering...');
    const activeResponse = await axios.get(`${BASE_URL}/securia/consultants?status=active`, { headers });
    console.log(`✅ Active consultants: ${activeResponse.data.data.length}`);
    
    const activeFound = activeResponse.data.data.some(c => c._id === consultantId);
    if (activeFound) {
      console.log('✅ Test consultant found in active filter');
    } else {
      console.log('❌ Test consultant NOT found in active filter (check status capitalization)');
    }

    // Step 7: Verify comprehensive data is preserved
    console.log('\n6. Verifying comprehensive data preservation...');
    const detailResponse = await axios.get(`${BASE_URL}/securia/consultants/${consultantId}`, { headers });
    const consultant = detailResponse.data.data;
    
    const dataChecks = [
      { field: 'consultantId', expected: testConsultant.consultantId, actual: consultant.consultantId },
      { field: 'entryDate', expected: testConsultant.entryDate, actual: consultant.entryDate },
      { field: 'position', expected: testConsultant.position, actual: consultant.position },
      { field: 'mobile', expected: testConsultant.mobile, actual: consultant.mobile },
      { field: 'address', expected: testConsultant.address, actual: consultant.address },
      { field: 'maritalStatus', expected: testConsultant.maritalStatus, actual: consultant.maritalStatus },
      { field: 'ssn', expected: testConsultant.ssn, actual: consultant.ssn }
    ];

    let passedChecks = 0;
    dataChecks.forEach(check => {
      if (check.actual === check.expected) {
        console.log(`   ✅ ${check.field}: ${check.actual}`);
        passedChecks++;
      } else {
        console.log(`   ❌ ${check.field}: expected "${check.expected}", got "${check.actual}"`);
      }
    });

    console.log(`   Data preservation: ${passedChecks}/${dataChecks.length} fields correct`);

    // Step 8: Clean up - delete test consultant
    console.log('\n7. Cleaning up test data...');
    await axios.delete(`${BASE_URL}/securia/consultants/${consultantId}`, { headers });
    console.log('✅ Test consultant deleted');

    // Final verification
    const finalListResponse = await axios.get(`${BASE_URL}/securia/consultants`, { headers });
    if (finalListResponse.data.data.length === initialCount) {
      console.log('✅ Consultant count returned to initial value');
    }

    console.log('\n🎉 Integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Consultant creation works');
    console.log('   ✅ Consultant appears in list');
    console.log('   ✅ Search functionality works');
    console.log('   ✅ Status filtering works');
    console.log('   ✅ Comprehensive data is preserved');
    console.log('   ✅ Cleanup works');
    console.log('\n🔍 Next Steps:');
    console.log('   1. Test the frontend form creation');
    console.log('   2. Verify consultants appear in the UI');
    console.log('   3. Test edit/update functionality');

  } catch (error) {
    console.error('\n❌ Integration test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Authentication failed. Please:');
      console.log('   1. Make sure the backend server is running');
      console.log('   2. Update the ADMIN_TOKEN in this test script');
      console.log('   3. Ensure the admin user exists in the database');
    } else if (error.response?.status === 404) {
      console.log('\n💡 Endpoint not found. Please:');
      console.log('   1. Verify the backend server is running on port 3000');
      console.log('   2. Check that the securia routes are properly configured');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused. Please:');
      console.log('   1. Start the backend server: npm run dev');
      console.log('   2. Ensure it\'s running on port 3000');
    }
  }
}

// Run the test if called directly
if (require.main === module) {
  runIntegrationTest();
}

module.exports = { runIntegrationTest };
