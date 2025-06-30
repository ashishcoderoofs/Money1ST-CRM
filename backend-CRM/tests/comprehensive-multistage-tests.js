/**
 * Comprehensive Multi-Stage Client API Test Suite
 * Tests all endpoints with detailed scenarios, edge cases, and performance metrics
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

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

function logTest(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}${details ? ': ' + details : ''}`);
  } else {
    testResults.failed++;
    testResults.errors.push(testName);
    console.log(`❌ ${testName}${details ? ': ' + details : ''}`);
  }
}

async function authenticate() {
  const result = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@money1st.com',
    password: 'admin123'
  });

  if (result.success && result.data.token) {
    console.log('🔐 Authentication successful');
    return result.data.token;
  } else {
    console.log('❌ Authentication failed:', result.error);
    return null;
  }
}

// Comprehensive test data sets
const testDataSets = {
  // Complete client with all possible fields
  maximalClient: {
    applicant: {
      title: 'Dr.',
      firstName: 'Alexander',
      lastName: 'Richardson',
      mi: 'J',
      suffix: 'PhD',
      maidenName: '',
      isConsultant: false,
      email: 'alex.richardson@comprehensive.test',
      homePhone: '555-100-0001',
      mobilePhone: '555-100-0002',
      otherPhone: '555-100-0003',
      fax: '555-100-0004',
      address: {
        street: '1234 Comprehensive Test Ave',
        city: 'Test City',
        county: 'Test County',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      employment: {
        employerName: 'Comprehensive Tech Solutions',
        position: 'Senior Software Architect',
        workPhone: '555-100-0005',
        yearsAtJob: 8,
        monthlyIncome: 12500,
        annualIncome: 150000,
        employmentType: 'Full-time'
      },
      demographics: {
        dateOfBirth: '1980-03-15',
        age: 43,
        ssn: '123-45-6789',
        sex: 'Male',
        maritalStatus: 'Married',
        race: 'Asian',
        ethnicity: 'Indian'
      },
      householdMembers: [
        {
          name: 'Sarah Richardson',
          relationship: 'Spouse',
          dateOfBirth: '1982-07-20',
          age: 41,
          ssn: '987-65-4321',
          sex: 'Female'
        },
        {
          name: 'Emma Richardson',
          relationship: 'Daughter',
          dateOfBirth: '2010-12-10',
          age: 13,
          sex: 'Female'
        }
      ]
    },
    coApplicant: {
      hasCoApplicant: true,
      title: 'Mrs.',
      firstName: 'Sarah',
      lastName: 'Richardson',
      mi: 'M',
      email: 'sarah.richardson@comprehensive.test',
      mobilePhone: '555-200-0001',
      address: {
        street: '1234 Comprehensive Test Ave',
        city: 'Test City',
        county: 'Test County',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      employment: {
        employerName: 'Healthcare Solutions Inc',
        position: 'Registered Nurse',
        annualIncome: 85000,
        monthlyIncome: 7083.33,
        employmentType: 'Full-time',
        yearsAtJob: 12
      },
      demographics: {
        dateOfBirth: '1982-07-20',
        age: 41,
        ssn: '987-65-4321',
        sex: 'Female',
        maritalStatus: 'Married'
      }
    },
    liabilities: [
      {
        debtorType: 'Joint',
        liabilityType: 'Credit Card',
        creditorName: 'Chase Sapphire',
        currentBalance: 8500,
        monthlyPayment: 350,
        payOff: false
      },
      {
        debtorType: 'Applicant',
        liabilityType: 'Auto Loan',
        creditorName: 'Toyota Financial',
        currentBalance: 25000,
        monthlyPayment: 485,
        payOff: false
      },
      {
        debtorType: 'Co-Applicant',
        liabilityType: 'Student Loan',
        creditorName: 'Federal Student Aid',
        currentBalance: 35000,
        monthlyPayment: 320,
        payOff: false
      }
    ],
    mortgages: [
      {
        propertyAddress: '1234 Comprehensive Test Ave, Test City, CA 90210',
        lender: 'Wells Fargo Mortgage',
        originalAmount: 650000,
        currentBalance: 580000,
        monthlyPayment: 3200,
        interestRate: 3.75,
        loanType: 'Conventional 30-Year Fixed',
        propertyValue: 750000,
        rentalIncome: 0
      }
    ],
    underwriting: {
      address: '1234 Comprehensive Test Ave',
      city: 'Test City',
      clientId: 'CLI-COMP-001',
      creditScore: 785,
      annualIncome: 235000,
      monthlyIncome: 19583.33,
      debtToIncomeRatio: 22.5,
      assets: 125000,
      liabilities: 648500,
      netWorth: -523500,
      loanAmount: 650000,
      loanToValueRatio: 86.67,
      propertyValue: 750000,
      downPayment: 100000,
      cashReserves: 25000,
      employmentHistory: '8+ years software development, 12+ years healthcare',
      notes: 'Excellent credit history, stable dual income household'
    },
    loanStatus: {
      applicationDate: '2023-03-15',
      status: 'Approved',
      loanType: 'Conventional',
      loanAmount: 650000,
      interestRate: 3.75,
      term: 30,
      closingDate: '2023-05-20',
      lender: 'Wells Fargo Mortgage',
      loanOfficer: 'Michael Stevens',
      notes: 'Approved with excellent terms due to strong financial profile'
    },
    drivers: [
      {
        fullName: 'Alexander J. Richardson',
        dateOfBirth: '1980-03-15',
        age: 43,
        relationship: 'Self',
        ssn: '123-45-6789',
        sex: 'Male',
        maritalStatus: 'Married',
        drivingStatus: 'Licensed',
        licenseNumber: 'D1234567',
        licenseState: 'CA',
        accidentsViolations: false,
        explanation: ''
      },
      {
        fullName: 'Sarah M. Richardson',
        dateOfBirth: '1982-07-20',
        age: 41,
        relationship: 'Spouse',
        ssn: '987-65-4321',
        sex: 'Female',
        maritalStatus: 'Married',
        drivingStatus: 'Licensed',
        licenseNumber: 'D7654321',
        licenseState: 'CA',
        accidentsViolations: true,
        explanation: 'Minor fender bender in 2020, no injuries'
      }
    ],
    vehicleCoverage: {
      hasVehicles: true,
      currentProvider: 'State Farm',
      policyNumber: 'SF-9876543210',
      coverageLimits: {
        liability: '250/500/100',
        collision: '$500 deductible',
        comprehensive: '$250 deductible',
        uninsuredMotorist: '250/500'
      },
      vehicles: [
        {
          year: 2022,
          make: 'Tesla',
          model: 'Model S',
          vin: '5YJ3E1EA4NF123456',
          usage: 'Personal',
          annualMileage: 15000,
          coverage: {
            liability: true,
            collision: true,
            comprehensive: true
          }
        },
        {
          year: 2021,
          make: 'Toyota',
          model: 'Prius',
          vin: 'JTDKARFU9M3123456',
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
      provider: 'Allstate Insurance',
      policyNumber: 'AL-HOME-123456789',
      coverageAmount: 750000,
      deductible: 2500,
      annualPremium: 2400,
      propertyValue: 750000,
      mortgageCompany: 'Wells Fargo Mortgage',
      additionalCoverage: [
        {
          type: 'Jewelry Coverage',
          amount: 25000
        },
        {
          type: 'Home Office Equipment',
          amount: 15000
        }
      ]
    },
    renters: {
      hasRentersInsurance: false
    },
    incomeProtection: {
      hasIncomeProtection: true,
      shortTermDisability: {
        provider: 'MetLife',
        policyNumber: 'ML-STD-789012',
        monthlyBenefit: 8000,
        eliminationPeriod: 14,
        benefitPeriod: 24
      },
      longTermDisability: {
        provider: 'Guardian Life',
        policyNumber: 'GL-LTD-345678',
        monthlyBenefit: 6000,
        eliminationPeriod: 90,
        benefitPeriod: 'Age 65'
      },
      lifeInsurance: [
        {
          provider: 'Northwestern Mutual',
          policyNumber: 'NM-LIFE-901234',
          faceAmount: 1000000,
          premiumAmount: 380,
          premiumFrequency: 'Monthly',
          beneficiaries: [
            {
              name: 'Sarah M. Richardson',
              relationship: 'Spouse',
              percentage: 75
            },
            {
              name: 'Emma Richardson',
              relationship: 'Daughter',
              percentage: 25
            }
          ]
        },
        {
          provider: 'Term Life Direct',
          policyNumber: 'TLD-TERM-567890',
          faceAmount: 500000,
          premiumAmount: 85,
          premiumFrequency: 'Monthly',
          beneficiaries: [
            {
              name: 'Sarah M. Richardson',
              relationship: 'Spouse',
              percentage: 100
            }
          ]
        }
      ]
    },
    retirement: {
      hasRetirementAccounts: true,
      currentAge: 43,
      desiredRetirementAge: 62,
      estimatedRetirementIncome: 8000,
      currentRetirementSavings: 285000,
      monthlyContribution: 2500,
      employerMatch: 6,
      retirementAccounts: [
        {
          accountType: '401k',
          provider: 'Fidelity Investments',
          currentBalance: 180000,
          monthlyContribution: 1500,
          employerMatch: 4.5,
          vestingSchedule: '100% vested after 3 years'
        },
        {
          accountType: 'IRA',
          provider: 'Vanguard',
          currentBalance: 65000,
          monthlyContribution: 500,
          employerMatch: 0,
          vestingSchedule: 'N/A'
        },
        {
          accountType: 'Roth IRA',
          provider: 'Charles Schwab',
          currentBalance: 40000,
          monthlyContribution: 500,
          employerMatch: 0,
          vestingSchedule: 'N/A'
        }
      ],
      retirementGoals: {
        monthlyIncomeNeeded: 8000,
        inflationRate: 3.0,
        rateOfReturn: 7.5,
        retirementDuration: 30
      }
    },
    lineage: {
      referralSource: 'Referral',
      referredBy: 'Dr. Michael Thompson',
      referrerContact: 'michael.thompson@referrer.com',
      originalContactDate: '2023-02-01',
      leadSource: 'Professional Network',
      marketingCampaign: 'Q1 2023 Professional Referral Program',
      notes: 'Referred by long-time colleague, high-value prospect',
      consultantNotes: 'Excellent prospect, very engaged and knowledgeable'
    }
  },
  
  // Edge case: Empty sections
  emptyClient: {
    applicant: {
      firstName: 'Empty',
      lastName: 'Test',
      email: 'empty@test.com'
    }
  },
  
  // Edge case: Large data values
  extremeValuesClient: {
    applicant: {
      firstName: 'Extreme',
      lastName: 'Values',
      email: 'extreme@test.com',
      employment: {
        annualIncome: 99999999, // Very high income
        yearsAtJob: 50 // Long tenure
      },
      demographics: {
        age: 100 // Very old
      }
    },
    underwriting: {
      creditScore: 850, // Perfect score
      annualIncome: 99999999,
      assets: 50000000,
      liabilities: 1000000
    }
  }
};

async function runComprehensiveTests(token) {
  console.log('\n🧪 Running Comprehensive Multi-Stage Client API Tests');
  console.log('='.repeat(70));
  
  const clientIds = [];

  // Test 1: Create maximal client with all possible data
  console.log('\n📋 Test Group 1: Client Creation with Various Data Sets');
  console.log('-'.repeat(50));
  
  const maximalResult = await makeRequest('POST', '/api/securia/clients/multistage', testDataSets.maximalClient, token);
  logTest('Create maximal client with all sections', maximalResult.success, 
    maximalResult.success ? `Completion: ${maximalResult.data.data.completionPercentage}%` : maximalResult.error);
  
  if (maximalResult.success) {
    clientIds.push(maximalResult.data.data.id);
  }

  // Test 2: Create empty client
  const emptyResult = await makeRequest('POST', '/api/securia/clients/multistage', testDataSets.emptyClient, token);
  logTest('Create minimal client', emptyResult.success,
    emptyResult.success ? `Completion: ${emptyResult.data.data.completionPercentage}%` : emptyResult.error);
  
  if (emptyResult.success) {
    clientIds.push(emptyResult.data.data.id);
  }

  // Test 3: Create client with extreme values
  const extremeResult = await makeRequest('POST', '/api/securia/clients/multistage', testDataSets.extremeValuesClient, token);
  logTest('Create client with extreme values', extremeResult.success,
    extremeResult.success ? `Completion: ${extremeResult.data.data.completionPercentage}%` : extremeResult.error);
  
  if (extremeResult.success) {
    clientIds.push(extremeResult.data.data.id);
  }

  // Test Group 2: Section-based operations
  console.log('\n🔧 Test Group 2: Section-based Operations');
  console.log('-'.repeat(50));
  
  if (clientIds.length > 0) {
    const testClientId = clientIds[0];
    
    // Test all individual sections
    const sections = ['applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 
                     'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 
                     'incomeProtection', 'retirement', 'lineage'];
    
    for (const section of sections) {
      const getSectionResult = await makeRequest('GET', `/api/securia/clients/${testClientId}/section/${section}`, null, token);
      logTest(`Get ${section} section`, getSectionResult.success,
        getSectionResult.success ? `Has data: ${Object.keys(getSectionResult.data.data.data || {}).length > 0}` : getSectionResult.error);
    }

    // Test section updates
    const updateTests = [
      {
        section: 'applicant',
        data: { ...testDataSets.maximalClient.applicant, mobilePhone: '555-UPDATED-1' }
      },
      {
        section: 'underwriting',
        data: { creditScore: 800, annualIncome: 200000, notes: 'Updated for testing' }
      },
      {
        section: 'loanStatus',
        data: { status: 'Funded', notes: 'Loan funded successfully' }
      }
    ];

    for (const update of updateTests) {
      const updateResult = await makeRequest('PUT', `/api/securia/clients/${testClientId}/section/${update.section}`, 
        { section: update.section, data: update.data }, token);
      logTest(`Update ${update.section} section`, updateResult.success,
        updateResult.success ? `New completion: ${updateResult.data.data.completionPercentage}%` : updateResult.error);
    }
  }

  // Test Group 3: Progress tracking
  console.log('\n📊 Test Group 3: Progress Tracking');
  console.log('-'.repeat(50));
  
  for (const clientId of clientIds) {
    const progressResult = await makeRequest('GET', `/api/securia/clients/${clientId}/progress`, null, token);
    logTest('Get client progress', progressResult.success,
      progressResult.success ? `${progressResult.data.data.completedCount}/${progressResult.data.data.totalSections} sections` : progressResult.error);
  }

  // Test Group 4: Bulk operations
  console.log('\n📦 Test Group 4: Bulk Operations');
  console.log('-'.repeat(50));
  
  if (clientIds.length > 0) {
    const bulkUpdateTests = [
      {
        name: 'Update multiple sections',
        sections: {
          underwriting: { creditScore: 820, notes: 'Bulk update test 1' },
          loanStatus: { status: 'Approved', notes: 'Bulk approved' }
        }
      },
      {
        name: 'Update with arrays',
        sections: {
          liabilities: [
            { debtorType: 'Applicant', liabilityType: 'Credit Card', creditorName: 'Updated Card', currentBalance: 1000, monthlyPayment: 100 }
          ],
          drivers: [
            { fullName: 'Updated Driver', age: 35, drivingStatus: 'Licensed', licenseState: 'CA' }
          ]
        }
      }
    ];

    for (const test of bulkUpdateTests) {
      const bulkResult = await makeRequest('PUT', `/api/securia/clients/${clientIds[0]}/bulk-update`, 
        { sections: test.sections }, token);
      logTest(test.name, bulkResult.success,
        bulkResult.success ? `Updated: [${bulkResult.data.data.updatedSections.join(', ')}]` : bulkResult.error);
    }
  }

  // Test Group 5: Error scenarios and validation
  console.log('\n⚠️ Test Group 5: Error Handling & Validation');
  console.log('-'.repeat(50));
  
  // Invalid client ID
  const invalidClientTest = await makeRequest('GET', '/api/securia/clients/invalid-id-123/progress', null, token);
  logTest('Handle invalid client ID', !invalidClientTest.success && [400, 404].includes(invalidClientTest.status),
    `Status: ${invalidClientTest.status}`);

  // Invalid section name
  const invalidSectionTest = await makeRequest('GET', `/api/securia/clients/${clientIds[0] || 'test'}/section/invalidSection`, null, token);
  logTest('Handle invalid section name', !invalidSectionTest.success && invalidSectionTest.status === 400,
    `Status: ${invalidSectionTest.status}`);

  // Missing required data
  const missingDataTest = await makeRequest('PUT', `/api/securia/clients/${clientIds[0] || 'test'}/section/applicant`, 
    { section: 'applicant' }, token);
  logTest('Handle missing section data', !missingDataTest.success && missingDataTest.status === 400,
    `Status: ${missingDataTest.status}`);

  // Invalid JSON structure
  const invalidJsonTest = await makeRequest('PUT', `/api/securia/clients/${clientIds[0] || 'test'}/bulk-update`, 
    { invalid: 'structure' }, token);
  logTest('Handle invalid JSON structure', !invalidJsonTest.success && invalidJsonTest.status === 400,
    `Status: ${invalidJsonTest.status}`);

  // Test Group 6: Performance and stress tests
  console.log('\n⚡ Test Group 6: Performance & Stress Tests');
  console.log('-'.repeat(50));
  
  // Concurrent client creation
  const startTime = Date.now();
  const concurrentPromises = [];
  
  for (let i = 0; i < 10; i++) {
    const clientData = {
      applicant: {
        firstName: `Concurrent${i}`,
        lastName: 'Test',
        email: `concurrent${i}@test.com`
      }
    };
    concurrentPromises.push(makeRequest('POST', '/api/securia/clients/multistage', clientData, token));
  }
  
  const concurrentResults = await Promise.all(concurrentPromises);
  const endTime = Date.now();
  const successful = concurrentResults.filter(r => r.success).length;
  
  logTest('Concurrent client creation', successful >= 8, // Allow some failures
    `${successful}/10 clients in ${endTime - startTime}ms`);

  // Large payload test
  const largeClient = {
    ...testDataSets.maximalClient,
    applicant: {
      ...testDataSets.maximalClient.applicant,
      notes: 'x'.repeat(5000) // Large notes field
    }
  };
  
  const largePayloadResult = await makeRequest('POST', '/api/securia/clients/multistage', largeClient, token);
  logTest('Handle large payload', largePayloadResult.success || largePayloadResult.status === 413,
    `Status: ${largePayloadResult.status}`);

  return clientIds;
}

async function main() {
  console.log('🚀 Comprehensive Multi-Stage Client API Test Suite');
  console.log('='.repeat(70));
  console.log('Testing all endpoints with various scenarios, edge cases, and stress tests');
  
  const startTime = Date.now();
  
  try {
    // Authenticate
    const token = await authenticate();
    if (!token) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Run comprehensive tests
    const clientIds = await runComprehensiveTests(token);

    // Generate final report
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n📊 FINAL TEST REPORT');
    console.log('='.repeat(50));
    console.log(`🕒 Total Duration: ${duration}ms`);
    console.log(`✅ Tests Passed: ${testResults.passed}`);
    console.log(`❌ Tests Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
    console.log(`📋 Clients Created: ${clientIds.length}`);
    
    if (testResults.failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      testResults.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n🎉 Test suite completed successfully!');
    
  } catch (error) {
    console.error('💥 Test suite error:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, runComprehensiveTests };
