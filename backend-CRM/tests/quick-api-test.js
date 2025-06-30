/**
 * Quick Multi-Stage Client API Test Script
 * Tests core functionality without authentication requirements
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api/securia';

// Helper function to make requests
async function makeRequest(method, url, data = null) {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    data,
    timeout: 10000
  };

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Test data
const testClient = {
  applicant: {
    firstName: 'John',
    lastName: 'TestUser',
    email: 'john.testuser@example.com',
    homePhone: '555-123-4567',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345'
    },
    demographics: {
      dateOfBirth: '1980-01-01',
      age: 43
    }
  },
  underwriting: {
    creditScore: 750,
    annualIncome: 75000
  },
  loanStatus: {
    status: 'Pre-Approval',
    loanType: 'Conventional'
  }
};

let createdClientId = null;

async function testServerConnection() {
  console.log('🔗 Testing server connection...');
  try {
    await axios.get(`${BASE_URL}/status`, { timeout: 5000 });
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return false;
  }
}

async function testCreateMultiStageClient() {
  console.log('\n📋 Testing: Create Multi-Stage Client');
  
  const result = await makeRequest('POST', '/clients/multistage', testClient);
  
  if (result.success) {
    console.log('✅ Client created successfully');
    console.log(`   Client ID: ${result.data.data.clientId}`);
    console.log(`   Database ID: ${result.data.data.id}`);
    console.log(`   Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
    
    createdClientId = result.data.data.id;
    return result.data.data;
  } else {
    console.log('❌ Failed to create client');
    console.log('   Error:', JSON.stringify(result.error, null, 2));
    return null;
  }
}

async function testUpdateClientSection() {
  if (!createdClientId) {
    console.log('❌ No client ID available for section update test');
    return;
  }

  console.log('\n🔄 Testing: Update Client Section');
  
  const sectionUpdate = {
    section: 'applicant',
    data: {
      ...testClient.applicant,
      mobilePhone: '555-999-8888', // Add mobile phone
      email: 'john.updated@example.com' // Update email
    }
  };
  
  const result = await makeRequest('PUT', `/clients/${createdClientId}/section/applicant`, sectionUpdate);
  
  if (result.success) {
    console.log('✅ Section updated successfully');
    console.log(`   Updated Section: ${result.data.data.updatedSection}`);
    console.log(`   New Completion: ${result.data.data.completionPercentage}%`);
  } else {
    console.log('❌ Failed to update section');
    console.log('   Error:', JSON.stringify(result.error, null, 2));
  }
}

async function testGetClientSection() {
  if (!createdClientId) {
    console.log('❌ No client ID available for section retrieval test');
    return;
  }

  console.log('\n📖 Testing: Get Client Section');
  
  const result = await makeRequest('GET', `/clients/${createdClientId}/section/applicant`);
  
  if (result.success) {
    console.log('✅ Section retrieved successfully');
    console.log(`   Section: ${result.data.data.section}`);
    console.log(`   Client ID: ${result.data.data.clientId}`);
    console.log(`   First Name: ${result.data.data.data.firstName}`);
    console.log(`   Email: ${result.data.data.data.email}`);
  } else {
    console.log('❌ Failed to get section');
    console.log('   Error:', JSON.stringify(result.error, null, 2));
  }
}

async function testGetClientProgress() {
  if (!createdClientId) {
    console.log('❌ No client ID available for progress test');
    return;
  }

  console.log('\n📊 Testing: Get Client Progress');
  
  const result = await makeRequest('GET', `/clients/${createdClientId}/progress`);
  
  if (result.success) {
    console.log('✅ Progress retrieved successfully');
    console.log(`   Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
    console.log(`   Completed Sections: ${result.data.data.completedCount}/${result.data.data.totalSections}`);
    console.log(`   Completed: [${result.data.data.completedSections.join(', ')}]`);
    
    // Show section progress details
    console.log('\n   📋 Section Progress Details:');
    Object.entries(result.data.data.sectionProgress).forEach(([section, progress]) => {
      const status = progress.completed ? '✅' : '⭕';
      console.log(`      ${status} ${section}: ${progress.completionPercentage}%`);
    });
  } else {
    console.log('❌ Failed to get progress');
    console.log('   Error:', JSON.stringify(result.error, null, 2));
  }
}

async function testBulkUpdateSections() {
  if (!createdClientId) {
    console.log('❌ No client ID available for bulk update test');
    return;
  }

  console.log('\n🔄📦 Testing: Bulk Update Multiple Sections');
  
  const bulkUpdate = {
    sections: {
      underwriting: {
        creditScore: 780,
        annualIncome: 85000,
        monthlyIncome: 7083.33,
        notes: 'Updated via bulk update test'
      },
      loanStatus: {
        status: 'Approved',
        loanType: 'Conventional',
        loanAmount: 250000,
        interestRate: 4.0
      },
      lineage: {
        referralSource: 'Website',
        leadSource: 'Google Search',
        notes: 'Test referral data'
      }
    }
  };
  
  const result = await makeRequest('PUT', `/clients/${createdClientId}/bulk-update`, bulkUpdate);
  
  if (result.success) {
    console.log('✅ Bulk update successful');
    console.log(`   Updated Sections: [${result.data.data.updatedSections.join(', ')}]`);
    console.log(`   New Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
  } else {
    console.log('❌ Failed bulk update');
    console.log('   Error:', JSON.stringify(result.error, null, 2));
  }
}

async function testValidationErrors() {
  console.log('\n⚠️ Testing: Validation Error Scenarios');
  
  // Test 1: Invalid section name
  console.log('   📝 Testing invalid section name...');
  const invalidSection = await makeRequest('PUT', `/clients/${createdClientId || 'test'}/section/invalidSection`, {
    section: 'invalidSection',
    data: { test: 'data' }
  });
  
  if (!invalidSection.success && invalidSection.status === 400) {
    console.log('   ✅ Correctly rejected invalid section name');
  } else {
    console.log('   ❌ Should have rejected invalid section name');
  }
  
  // Test 2: Missing required data
  console.log('   📝 Testing missing section data...');
  const missingData = await makeRequest('PUT', `/clients/${createdClientId || 'test'}/section/applicant`, {
    section: 'applicant'
    // Missing data field
  });
  
  if (!missingData.success && missingData.status === 400) {
    console.log('   ✅ Correctly rejected missing data');
  } else {
    console.log('   ❌ Should have rejected missing data');
  }
}

async function testGetAllSections() {
  if (!createdClientId) {
    console.log('❌ No client ID available for all sections test');
    return;
  }

  console.log('\n📚 Testing: Get All Client Sections');
  
  const sections = ['applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 'incomeProtection', 'retirement', 'lineage'];
  
  for (const section of sections) {
    const result = await makeRequest('GET', `/clients/${createdClientId}/section/${section}`);
    
    if (result.success) {
      const hasData = Object.keys(result.data.data.data).length > 0;
      const status = hasData ? '✅' : '⭕';
      console.log(`   ${status} ${section}: ${hasData ? 'Has Data' : 'Empty'}`);
    } else {
      console.log(`   ❌ ${section}: Error - ${result.error.error || result.error}`);
    }
  }
}

async function runQuickTests() {
  console.log('🚀 Starting Quick Multi-Stage Client API Tests');
  console.log('='.repeat(60));
  
  try {
    // Check server connection
    const serverOk = await testServerConnection();
    if (!serverOk) {
      console.log('\n❌ Cannot connect to server. Please ensure the server is running on port 3000.');
      return;
    }
    
    // Run tests
    await testCreateMultiStageClient();
    await testUpdateClientSection();
    await testGetClientSection();
    await testGetClientProgress();
    await testBulkUpdateSections();
    await testGetAllSections();
    await testValidationErrors();
    
    // Final progress check
    if (createdClientId) {
      console.log('\n📊 Final Progress Check:');
      await testGetClientProgress();
    }
    
    console.log('\n🎉 Quick tests completed!');
    console.log('='.repeat(60));
    
    if (createdClientId) {
      console.log(`\n💡 Created test client ID: ${createdClientId}`);
      console.log('   You can use this ID for manual testing in Postman or other tools.');
    }
    
  } catch (error) {
    console.error('\n💥 Test runner error:', error.message);
  }
}

// Run tests if called directly
if (require.main === module) {
  runQuickTests();
}

module.exports = { runQuickTests, testClient, makeRequest };
