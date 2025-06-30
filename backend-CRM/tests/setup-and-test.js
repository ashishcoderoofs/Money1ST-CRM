/**
 * Setup test environment and run multi-stage client API tests
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Helper function to make requests
async function makeRequest(method, url, data = null, token = null) {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    data
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

async function createTestUser() {
  console.log('👤 Creating test admin user...');
  
  const userData = {
    consultantId: 'ADMIN001',
    firstName: 'Test',
    lastName: 'Admin',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'Admin',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345'
  };

  const result = await makeRequest('POST', '/api/auth/register', userData);
  
  if (result.success) {
    console.log('✅ Test admin user created successfully');
    return true;
  } else if (result.status === 409) {
    console.log('✅ Test admin user already exists');
    return true;
  } else {
    console.log('❌ Failed to create test user:', result.error);
    return false;
  }
}

async function authenticateUser() {
  console.log('🔐 Authenticating test user...');
  
  const result = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@money1st.com',
    password: 'admin123'
  });

  if (result.success && result.data.token) {
    console.log('✅ Authentication successful');
    return result.data.token;
  } else {
    console.log('❌ Authentication failed:', result.error);
    return null;
  }
}

async function testMultiStageEndpoints(token) {
  console.log('\n🚀 Testing Multi-Stage Client Endpoints...');
  console.log('='.repeat(50));

  // Test data
  const completeClient = {
    applicant: {
      title: 'Mr.',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      homePhone: '555-123-4567',
      mobilePhone: '555-987-6543',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345'
      },
      employment: {
        employerName: 'Tech Corp',
        position: 'Software Engineer',
        annualIncome: 85000,
        employmentType: 'Full-time'
      },
      demographics: {
        dateOfBirth: '1985-05-15',
        age: 38,
        sex: 'Male',
        maritalStatus: 'Married'
      }
    },
    underwriting: {
      creditScore: 750,
      annualIncome: 85000,
      monthlyIncome: 7083.33
    },
    loanStatus: {
      status: 'Under Review',
      loanType: 'Conventional',
      loanAmount: 300000
    }
  };

  const minimalClient = {
    applicant: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@test.com'
    }
  };

  let testClientId = '';

  // Test 1: Create complete multi-stage client
  console.log('\n📋 Test 1: Create Complete Multi-Stage Client');
  const createComplete = await makeRequest('POST', '/api/securia/clients/multistage', completeClient, token);
  
  if (createComplete.success) {
    console.log('✅ Complete client created successfully');
    console.log(`   Client ID: ${createComplete.data.data.clientId}`);
    console.log(`   Completion: ${createComplete.data.data.completionPercentage}%`);
    console.log(`   Status: ${createComplete.data.data.status}`);
    testClientId = createComplete.data.data.id;
  } else {
    console.log('❌ Failed to create complete client:', createComplete.error);
  }

  // Test 2: Create minimal client
  console.log('\n📝 Test 2: Create Minimal Client');
  const createMinimal = await makeRequest('POST', '/api/securia/clients/multistage', minimalClient, token);
  
  if (createMinimal.success) {
    console.log('✅ Minimal client created successfully');
    console.log(`   Client ID: ${createMinimal.data.data.clientId}`);
    console.log(`   Completion: ${createMinimal.data.data.completionPercentage}%`);
    console.log(`   Status: ${createMinimal.data.data.status}`);
  } else {
    console.log('❌ Failed to create minimal client:', createMinimal.error);
  }

  if (!testClientId) {
    console.log('❌ No test client available for remaining tests');
    return;
  }

  // Test 3: Get client progress
  console.log('\n📊 Test 3: Get Client Progress');
  const getProgress = await makeRequest('GET', `/api/securia/clients/${testClientId}/progress`, null, token);
  
  if (getProgress.success) {
    console.log('✅ Progress retrieved successfully');
    console.log(`   Completion: ${getProgress.data.data.completionPercentage}%`);
    console.log(`   Status: ${getProgress.data.data.status}`);
    console.log(`   Completed: ${getProgress.data.data.completedCount}/${getProgress.data.data.totalSections} sections`);
    console.log(`   Sections: [${getProgress.data.data.completedSections.join(', ')}]`);
  } else {
    console.log('❌ Failed to get progress:', getProgress.error);
  }

  // Test 4: Get specific section
  console.log('\n📖 Test 4: Get Client Section');
  const getSection = await makeRequest('GET', `/api/securia/clients/${testClientId}/section/applicant`, null, token);
  
  if (getSection.success) {
    console.log('✅ Section retrieved successfully');
    console.log(`   Section: ${getSection.data.data.section}`);
    console.log(`   Has Data: ${Object.keys(getSection.data.data.data).length > 0}`);
  } else {
    console.log('❌ Failed to get section:', getSection.error);
  }

  // Test 5: Update client section
  console.log('\n🔄 Test 5: Update Client Section');
  const sectionUpdate = {
    section: 'applicant',
    data: {
      ...completeClient.applicant,
      mobilePhone: '555-NEW-PHONE',
      address: {
        ...completeClient.applicant.address,
        street: '456 Updated Street'
      }
    }
  };
  
  const updateSection = await makeRequest('PUT', `/api/securia/clients/${testClientId}/section/applicant`, sectionUpdate, token);
  
  if (updateSection.success) {
    console.log('✅ Section updated successfully');
    console.log(`   Updated Section: ${updateSection.data.data.updatedSection}`);
    console.log(`   New Completion: ${updateSection.data.data.completionPercentage}%`);
  } else {
    console.log('❌ Failed to update section:', updateSection.error);
  }

  // Test 6: Bulk update sections
  console.log('\n🔄📦 Test 6: Bulk Update Multiple Sections');
  const bulkUpdate = {
    sections: {
      underwriting: {
        creditScore: 780,
        annualIncome: 90000,
        notes: 'Updated via bulk update test'
      },
      loanStatus: {
        status: 'Approved',
        interestRate: 4.0,
        notes: 'Loan approved after bulk update'
      }
    }
  };
  
  const bulkUpdateResult = await makeRequest('PUT', `/api/securia/clients/${testClientId}/bulk-update`, bulkUpdate, token);
  
  if (bulkUpdateResult.success) {
    console.log('✅ Bulk update successful');
    console.log(`   Updated Sections: [${bulkUpdateResult.data.data.updatedSections.join(', ')}]`);
    console.log(`   New Completion: ${bulkUpdateResult.data.data.completionPercentage}%`);
  } else {
    console.log('❌ Failed bulk update:', bulkUpdateResult.error);
  }

  // Test 7: Progressive form filling
  console.log('\n📝➡️📋 Test 7: Progressive Form Filling');
  
  // Create another minimal client for progressive testing
  const progressTest = {
    applicant: {
      firstName: 'Progressive',
      lastName: 'Test',
      email: 'progressive@test.com'
    }
  };
  
  const createProgressive = await makeRequest('POST', '/api/securia/clients/multistage', progressTest, token);
  
  if (createProgressive.success) {
    const progressClientId = createProgressive.data.data.id;
    console.log(`   ✅ Progressive client created (${createProgressive.data.data.completionPercentage}%)`);
    
    // Add underwriting
    const addUnderwriting = await makeRequest('PUT', `/api/securia/clients/${progressClientId}/section/underwriting`, {
      section: 'underwriting',
      data: {
        creditScore: 720,
        annualIncome: 75000
      }
    }, token);
    
    if (addUnderwriting.success) {
      console.log(`   ✅ Underwriting added (${addUnderwriting.data.data.completionPercentage}%)`);
    }
    
    // Add loan status
    const addLoanStatus = await makeRequest('PUT', `/api/securia/clients/${progressClientId}/section/loanStatus`, {
      section: 'loanStatus',
      data: {
        status: 'Pre-Approval',
        loanType: 'Conventional'
      }
    }, token);
    
    if (addLoanStatus.success) {
      console.log(`   ✅ Loan status added (${addLoanStatus.data.data.completionPercentage}%)`);
    }
  } else {
    console.log('   ❌ Failed to create progressive test client');
  }

  // Test 8: Validation errors
  console.log('\n⚠️ Test 8: Validation Error Scenarios');
  
  // Invalid section name
  const invalidSection = await makeRequest('PUT', `/api/securia/clients/${testClientId}/section/invalidSection`, {
    section: 'invalidSection',
    data: { test: 'data' }
  }, token);
  
  if (!invalidSection.success && invalidSection.status === 400) {
    console.log('   ✅ Correctly rejected invalid section name');
  } else {
    console.log('   ❌ Should have rejected invalid section name');
  }
  
  // Missing data
  const missingData = await makeRequest('PUT', `/api/securia/clients/${testClientId}/section/applicant`, {
    section: 'applicant'
  }, token);
  
  if (!missingData.success && missingData.status === 400) {
    console.log('   ✅ Correctly rejected missing data');
  } else {
    console.log('   ❌ Should have rejected missing data');
  }

  console.log('\n🎉 Multi-stage client API tests completed!');
  console.log('='.repeat(50));
}

async function main() {
  console.log('🚀 Multi-Stage Client API Test Setup & Execution');
  console.log('='.repeat(60));

  try {
    // Step 1: Authenticate (skip user creation since admin already exists)
    const token = await authenticateUser();
    if (!token) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Step 2: Run tests
    await testMultiStageEndpoints(token);

  } catch (error) {
    console.error('💥 Test execution error:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, testMultiStageEndpoints };
