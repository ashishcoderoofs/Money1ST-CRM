/**
 * Multi-Stage Client API Testing Script
 * Tests all the new multi-stage client endpoints with various scenarios
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api/securia';
let authToken = '';
let testClientId = '';

// Test data for different scenarios
const testData = {
  // Scenario 1: Complete multi-stage client data
  completeClient: {
    applicant: {
      title: 'Mr.',
      firstName: 'John',
      lastName: 'Doe',
      mi: 'A',
      email: 'john.doe@example.com',
      homePhone: '555-123-4567',
      mobilePhone: '555-987-6543',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        county: 'Test County'
      },
      employment: {
        employerName: 'Tech Corp',
        position: 'Software Engineer',
        annualIncome: 85000,
        monthlyIncome: 7083.33,
        employmentType: 'Full-time',
        yearsAtJob: 3
      },
      demographics: {
        dateOfBirth: '1985-05-15',
        age: 38,
        ssn: '123-45-6789',
        sex: 'Male',
        maritalStatus: 'Married'
      },
      householdMembers: [
        {
          name: 'Jane Doe',
          relationship: 'Spouse',
          dateOfBirth: '1987-08-20',
          age: 36,
          sex: 'Female'
        }
      ]
    },
    coApplicant: {
      hasCoApplicant: true,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      mobilePhone: '555-456-7890',
      employment: {
        employerName: 'Healthcare Inc',
        position: 'Nurse',
        annualIncome: 65000,
        employmentType: 'Full-time'
      }
    },
    liabilities: [
      {
        debtorType: 'Joint',
        liabilityType: 'Credit Card',
        creditorName: 'Chase Bank',
        currentBalance: 5000,
        monthlyPayment: 250
      },
      {
        debtorType: 'Applicant',
        liabilityType: 'Auto Loan',
        creditorName: 'Wells Fargo',
        currentBalance: 15000,
        monthlyPayment: 450
      }
    ],
    mortgages: [
      {
        propertyAddress: '123 Main St, Anytown, CA 12345',
        lender: 'Bank of America',
        originalAmount: 300000,
        currentBalance: 280000,
        monthlyPayment: 1800,
        interestRate: 4.25,
        loanType: 'Conventional',
        propertyValue: 350000
      }
    ],
    underwriting: {
      creditScore: 750,
      annualIncome: 150000,
      monthlyIncome: 12500,
      debtToIncomeRatio: 32,
      assets: 50000,
      liabilities: 300000,
      netWorth: -250000,
      loanAmount: 300000,
      propertyValue: 350000,
      downPayment: 50000
    },
    loanStatus: {
      applicationDate: '2023-01-15',
      status: 'Under Review',
      loanType: 'Conventional',
      loanAmount: 300000,
      interestRate: 4.25,
      term: 30,
      lender: 'Bank of America',
      loanOfficer: 'Mike Johnson'
    },
    drivers: [
      {
        fullName: 'John A. Doe',
        dateOfBirth: '1985-05-15',
        age: 38,
        relationship: 'Self',
        drivingStatus: 'Licensed',
        licenseNumber: 'D123456789',
        licenseState: 'CA',
        accidentsViolations: false
      },
      {
        fullName: 'Jane Doe',
        dateOfBirth: '1987-08-20',
        age: 36,
        relationship: 'Spouse',
        drivingStatus: 'Licensed',
        licenseNumber: 'D987654321',
        licenseState: 'CA',
        accidentsViolations: false
      }
    ],
    vehicleCoverage: {
      hasVehicles: true,
      currentProvider: 'State Farm',
      policyNumber: 'SF123456789',
      coverageLimits: {
        liability: '100/300/100',
        collision: '$500 deductible',
        comprehensive: '$250 deductible',
        uninsuredMotorist: '100/300'
      },
      vehicles: [
        {
          year: 2020,
          make: 'Toyota',
          model: 'Camry',
          vin: '1234567890ABCDEFG',
          usage: 'Personal',
          annualMileage: 12000,
          coverage: {
            liability: true,
            collision: true,
            comprehensive: true
          }
        }
      ]
    },
    homeowners: {
      hasHomeInsurance: true,
      provider: 'Allstate',
      policyNumber: 'AL987654321',
      coverageAmount: 350000,
      deductible: 1000,
      annualPremium: 1200,
      propertyValue: 350000,
      mortgageCompany: 'Bank of America'
    },
    renters: {
      hasRentersInsurance: false
    },
    incomeProtection: {
      hasIncomeProtection: true,
      shortTermDisability: {
        provider: 'MetLife',
        policyNumber: 'ML123456',
        monthlyBenefit: 3000,
        eliminationPeriod: 14,
        benefitPeriod: 24
      },
      lifeInsurance: [
        {
          provider: 'New York Life',
          policyNumber: 'NYL789012',
          faceAmount: 500000,
          premiumAmount: 150,
          premiumFrequency: 'Monthly',
          beneficiaries: [
            {
              name: 'Jane Doe',
              relationship: 'Spouse',
              percentage: 100
            }
          ]
        }
      ]
    },
    retirement: {
      hasRetirementAccounts: true,
      currentAge: 38,
      desiredRetirementAge: 65,
      currentRetirementSavings: 75000,
      monthlyContribution: 800,
      retirementAccounts: [
        {
          accountType: '401k',
          provider: 'Fidelity',
          currentBalance: 50000,
          monthlyContribution: 500,
          employerMatch: 3
        },
        {
          accountType: 'IRA',
          provider: 'Vanguard',
          currentBalance: 25000,
          monthlyContribution: 300
        }
      ]
    },
    lineage: {
      referralSource: 'Referral',
      referredBy: 'Bob Smith',
      referrerContact: 'bob.smith@example.com',
      originalContactDate: '2023-01-01',
      leadSource: 'Personal Network',
      notes: 'Referred by longtime friend'
    }
  },

  // Scenario 2: Minimal client data
  minimalClient: {
    applicant: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com'
    }
  },

  // Scenario 3: Partial data for progressive form filling
  partialClient: {
    applicant: {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      homePhone: '555-111-2222',
      demographics: {
        dateOfBirth: '1975-12-01',
        age: 48
      }
    },
    underwriting: {
      creditScore: 680,
      annualIncome: 75000
    }
  }
};

// Helper function to make authenticated requests
async function makeRequest(method, url, data = null) {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
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

// Test functions
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  // First try regular login endpoint
  const result = await makeRequest('POST', '/../auth/login', {
    email: 'admin@test.com', // You'll need to adjust this to match your test admin user
    password: 'admin123'     // You'll need to adjust this to match your test admin password
  });

  if (result.success && result.data.token) {
    console.log('✅ Authentication successful');
    authToken = result.data.token;
    return true;
  } else {
    console.log('❌ Regular auth failed, trying securia reauth:', result.error);
    
    // Try securia reauth as fallback
    const securiaResult = await makeRequest('POST', '/reauth', {
      email: 'admin@test.com',
      password: 'admin123'
    });

    if (securiaResult.success) {
      console.log('✅ Securia reauth successful');
      // Note: Securia reauth might not return token in the same format
      if (securiaResult.data.token) {
        authToken = securiaResult.data.token;
      } else {
        // Try to proceed without token for now to test endpoints
        console.log('⚠️ No token received, proceeding with test endpoints...');
      }
      return true;
    } else {
      console.log('❌ Authentication failed:', securiaResult.error);
      return false;
    }
  }
}

async function testCreateCompleteClient() {
  console.log('\n📋 Testing: Create Complete Multi-Stage Client...');
  
  const result = await makeRequest('POST', '/clients/multistage', testData.completeClient);
  
  if (result.success) {
    console.log('✅ Complete client created successfully');
    console.log(`   Client ID: ${result.data.data.clientId}`);
    console.log(`   Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
    testClientId = result.data.data.id; // Store for other tests
    return result.data.data;
  } else {
    console.log('❌ Failed to create complete client:', result.error);
    return null;
  }
}

async function testCreateMinimalClient() {
  console.log('\n📝 Testing: Create Minimal Client...');
  
  const result = await makeRequest('POST', '/clients/multistage', testData.minimalClient);
  
  if (result.success) {
    console.log('✅ Minimal client created successfully');
    console.log(`   Client ID: ${result.data.data.clientId}`);
    console.log(`   Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
    return result.data.data;
  } else {
    console.log('❌ Failed to create minimal client:', result.error);
    return null;
  }
}

async function testUpdateClientSection() {
  if (!testClientId) {
    console.log('❌ No test client ID available for section update test');
    return;
  }

  console.log('\n🔄 Testing: Update Client Section...');
  
  const sectionUpdate = {
    section: 'applicant',
    data: {
      ...testData.completeClient.applicant,
      mobilePhone: '555-NEW-PHONE', // Update phone number
      address: {
        ...testData.completeClient.applicant.address,
        street: '456 Updated Street' // Update address
      }
    }
  };
  
  const result = await makeRequest('PUT', `/clients/${testClientId}/section/applicant`, sectionUpdate);
  
  if (result.success) {
    console.log('✅ Section updated successfully');
    console.log(`   Updated Section: ${result.data.data.updatedSection}`);
    console.log(`   New Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
  } else {
    console.log('❌ Failed to update section:', result.error);
  }
}

async function testGetClientSection() {
  if (!testClientId) {
    console.log('❌ No test client ID available for section retrieval test');
    return;
  }

  console.log('\n📖 Testing: Get Client Section...');
  
  const result = await makeRequest('GET', `/clients/${testClientId}/section/applicant`);
  
  if (result.success) {
    console.log('✅ Section retrieved successfully');
    console.log(`   Section: ${result.data.data.section}`);
    console.log(`   Client ID: ${result.data.data.clientId}`);
    console.log(`   Has Data: ${Object.keys(result.data.data.data).length > 0}`);
  } else {
    console.log('❌ Failed to get section:', result.error);
  }
}

async function testGetClientProgress() {
  if (!testClientId) {
    console.log('❌ No test client ID available for progress test');
    return;
  }

  console.log('\n📊 Testing: Get Client Progress...');
  
  const result = await makeRequest('GET', `/clients/${testClientId}/progress`);
  
  if (result.success) {
    console.log('✅ Progress retrieved successfully');
    console.log(`   Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
    console.log(`   Completed Sections: ${result.data.data.completedCount}/${result.data.data.totalSections}`);
    console.log(`   Completed: [${result.data.data.completedSections.join(', ')}]`);
  } else {
    console.log('❌ Failed to get progress:', result.error);
  }
}

async function testBulkUpdateSections() {
  if (!testClientId) {
    console.log('❌ No test client ID available for bulk update test');
    return;
  }

  console.log('\n🔄📦 Testing: Bulk Update Multiple Sections...');
  
  const bulkUpdate = {
    sections: {
      underwriting: {
        creditScore: 780, // Updated credit score
        annualIncome: 160000, // Updated income
        notes: 'Updated via bulk update test'
      },
      loanStatus: {
        status: 'Approved',
        interestRate: 4.0,
        notes: 'Loan approved after bulk update'
      },
      lineage: {
        referralSource: 'Website',
        notes: 'Updated referral information'
      }
    }
  };
  
  const result = await makeRequest('PUT', `/clients/${testClientId}/bulk-update`, bulkUpdate);
  
  if (result.success) {
    console.log('✅ Bulk update successful');
    console.log(`   Updated Sections: [${result.data.data.updatedSections.join(', ')}]`);
    console.log(`   New Completion: ${result.data.data.completionPercentage}%`);
    console.log(`   Status: ${result.data.data.status}`);
  } else {
    console.log('❌ Failed bulk update:', result.error);
  }
}

async function testValidationErrors() {
  console.log('\n⚠️ Testing: Validation Error Scenarios...');
  
  // Test 1: Invalid section name
  console.log('  📝 Testing invalid section name...');
  const invalidSection = await makeRequest('PUT', `/clients/${testClientId || 'test'}/section/invalidSection`, {
    section: 'invalidSection',
    data: { test: 'data' }
  });
  
  if (!invalidSection.success && invalidSection.status === 400) {
    console.log('  ✅ Correctly rejected invalid section name');
  } else {
    console.log('  ❌ Should have rejected invalid section name');
  }
  
  // Test 2: Missing section data
  console.log('  📝 Testing missing section data...');
  const missingData = await makeRequest('PUT', `/clients/${testClientId || 'test'}/section/applicant`, {
    section: 'applicant'
    // Missing data field
  });
  
  if (!missingData.success && missingData.status === 400) {
    console.log('  ✅ Correctly rejected missing data');
  } else {
    console.log('  ❌ Should have rejected missing data');
  }
  
  // Test 3: Invalid client ID
  console.log('  📝 Testing invalid client ID...');
  const invalidId = await makeRequest('GET', '/clients/invalid-id-123/progress');
  
  if (!invalidId.success && (invalidId.status === 404 || invalidId.status === 400)) {
    console.log('  ✅ Correctly rejected invalid client ID');
  } else {
    console.log('  ❌ Should have rejected invalid client ID');
  }
}

async function testProgressiveFormFilling() {
  console.log('\n📝➡️📋 Testing: Progressive Form Filling Scenario...');
  
  // Step 1: Create minimal client
  console.log('  Step 1: Creating minimal client...');
  const minimal = await makeRequest('POST', '/clients/multistage', testData.minimalClient);
  
  if (!minimal.success) {
    console.log('  ❌ Failed to create initial minimal client');
    return;
  }
  
  const clientId = minimal.data.data.id;
  console.log(`  ✅ Minimal client created (${minimal.data.data.completionPercentage}% complete)`);
  
  // Step 2: Add underwriting information
  console.log('  Step 2: Adding underwriting information...');
  const underwritingUpdate = await makeRequest('PUT', `/clients/${clientId}/section/underwriting`, {
    section: 'underwriting',
    data: {
      creditScore: 720,
      annualIncome: 95000,
      monthlyIncome: 7916.67,
      debtToIncomeRatio: 28
    }
  });
  
  if (underwritingUpdate.success) {
    console.log(`  ✅ Underwriting added (${underwritingUpdate.data.data.completionPercentage}% complete)`);
  }
  
  // Step 3: Add loan status
  console.log('  Step 3: Adding loan status...');
  const loanStatusUpdate = await makeRequest('PUT', `/clients/${clientId}/section/loanStatus`, {
    section: 'loanStatus',
    data: {
      status: 'Pre-Approval',
      loanType: 'Conventional',
      loanAmount: 250000
    }
  });
  
  if (loanStatusUpdate.success) {
    console.log(`  ✅ Loan status added (${loanStatusUpdate.data.data.completionPercentage}% complete)`);
  }
  
  // Step 4: Check final progress
  console.log('  Step 4: Checking final progress...');
  const finalProgress = await makeRequest('GET', `/clients/${clientId}/progress`);
  
  if (finalProgress.success) {
    console.log(`  ✅ Progressive filling complete!`);
    console.log(`     Final completion: ${finalProgress.data.data.completionPercentage}%`);
    console.log(`     Completed sections: [${finalProgress.data.data.completedSections.join(', ')}]`);
  }
}

// Error handling scenarios
async function testErrorScenarios() {
  console.log('\n🚨 Testing: Error Handling Scenarios...');
  
  // Test unauthorized access (if auth is implemented)
  console.log('  📝 Testing unauthorized access...');
  const originalToken = authToken;
  authToken = 'invalid-token';
  
  const unauthorized = await makeRequest('GET', '/clients');
  
  if (!unauthorized.success && [401, 403].includes(unauthorized.status)) {
    console.log('  ✅ Correctly handled unauthorized access');
  } else {
    console.log('  ❌ Should have rejected unauthorized access');
  }
  
  authToken = originalToken; // Restore token
  
  // Test large payload
  console.log('  📝 Testing large payload handling...');
  const largeClient = {
    ...testData.completeClient,
    applicant: {
      ...testData.completeClient.applicant,
      notes: 'x'.repeat(10000) // Large notes field
    }
  };
  
  const largePayload = await makeRequest('POST', '/clients/multistage', largeClient);
  
  if (largePayload.success || largePayload.status === 413) {
    console.log('  ✅ Large payload handled appropriately');
  } else {
    console.log('  ⚠️ Large payload response:', largePayload.status);
  }
}

// Performance testing
async function testPerformance() {
  console.log('\n⚡ Testing: Performance Scenarios...');
  
  const startTime = Date.now();
  const promises = [];
  
  // Create 5 clients concurrently
  for (let i = 0; i < 5; i++) {
    const clientData = {
      ...testData.minimalClient,
      applicant: {
        ...testData.minimalClient.applicant,
        email: `performance.test.${i}@example.com`
      }
    };
    promises.push(makeRequest('POST', '/clients/multistage', clientData));
  }
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  
  const successful = results.filter(r => r.success).length;
  const duration = endTime - startTime;
  
  console.log(`  ✅ Created ${successful}/5 clients in ${duration}ms`);
  console.log(`  📊 Average: ${Math.round(duration / 5)}ms per client`);
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Multi-Stage Client API Tests...');
  console.log('='.repeat(50));
  
  try {
    // Authentication test
    const authSuccess = await testAuthentication();
    if (!authSuccess) {
      console.log('\n❌ Authentication failed. Skipping remaining tests that require auth.');
      // Continue with tests that don't require auth
    }
    
    // Basic CRUD tests
    await testCreateCompleteClient();
    await testCreateMinimalClient();
    await testUpdateClientSection();
    await testGetClientSection();
    await testGetClientProgress();
    await testBulkUpdateSections();
    
    // Advanced scenarios
    await testProgressiveFormFilling();
    await testValidationErrors();
    await testErrorScenarios();
    await testPerformance();
    
    console.log('\n🎉 All tests completed!');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n💥 Test runner error:', error);
  }
}

// Export for use as module or run directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testData,
  makeRequest
};
