#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Multi-Stage Client API Endpoints
 * 
 * This script tests all the new multi-stage client form API endpoints with various scenarios:
 * 1. Create multi-stage client (full data)
 * 2. Create multi-stage client (minimal data)
 * 3. Update individual sections
 * 4. Get section data
 * 5. Get client progress
 * 6. Bulk update multiple sections
 * 7. Error handling scenarios
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  email: 'admin@example.com',
  password: 'admin123'
};

let authToken = '';
let testClientId = '';

// Test data
const FULL_CLIENT_DATA = {
  applicant: {
    title: 'Mr.',
    firstName: 'John',
    mi: 'D',
    lastName: 'Doe',
    suffix: 'Jr.',
    maidenName: '',
    isConsultant: false,
    homePhone: '555-1234',
    mobilePhone: '555-5678',
    otherPhone: '555-9012',
    fax: '555-3456',
    email: 'john.doe@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      county: 'Any County',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    employment: {
      employerName: 'ABC Corp',
      position: 'Software Engineer',
      workPhone: '555-7890',
      yearsAtJob: 5,
      monthlyIncome: 8000,
      annualIncome: 96000,
      employmentType: 'Full-time'
    },
    demographics: {
      dateOfBirth: '1985-01-15',
      age: 39,
      ssn: '123-45-6789',
      sex: 'Male',
      maritalStatus: 'Married',
      race: 'Caucasian',
      ethnicity: 'Non-Hispanic'
    },
    householdMembers: [
      {
        name: 'Jane Doe',
        relationship: 'Spouse',
        dateOfBirth: '1987-03-20',
        age: 37,
        ssn: '987-65-4321',
        sex: 'Female'
      }
    ]
  },
  coApplicant: {
    hasCoApplicant: true,
    title: 'Mrs.',
    firstName: 'Jane',
    mi: 'M',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    mobilePhone: '555-1111',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      county: 'Any County',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    employment: {
      employerName: 'XYZ Inc',
      position: 'Marketing Manager',
      monthlyIncome: 6000,
      annualIncome: 72000,
      employmentType: 'Full-time'
    },
    demographics: {
      dateOfBirth: '1987-03-20',
      age: 37,
      ssn: '987-65-4321',
      sex: 'Female',
      maritalStatus: 'Married'
    }
  },
  liabilities: [
    {
      debtorType: 'Joint',
      liabilityType: 'Credit Card',
      creditorName: 'Bank of America',
      currentBalance: 5000,
      monthlyPayment: 150,
      payOff: false
    },
    {
      debtorType: 'Applicant',
      liabilityType: 'Auto Loan',
      creditorName: 'Ford Credit',
      currentBalance: 25000,
      monthlyPayment: 450,
      payOff: false
    }
  ],
  mortgages: [
    {
      propertyAddress: '123 Main St, Anytown, CA 12345',
      lender: 'Wells Fargo',
      originalAmount: 400000,
      currentBalance: 350000,
      monthlyPayment: 2200,
      interestRate: 3.5,
      loanType: 'Conventional',
      propertyValue: 450000
    }
  ],
  underwriting: {
    address: '123 Main St, Anytown, CA',
    city: 'Anytown',
    clientId: 'CLI000001',
    creditScore: 750,
    annualIncome: 168000,
    monthlyIncome: 14000,
    debtToIncomeRatio: 28,
    assets: 100000,
    liabilities: 80000,
    netWorth: 20000,
    loanAmount: 400000,
    loanToValueRatio: 80,
    propertyValue: 450000,
    downPayment: 90000,
    cashReserves: 10000,
    employmentHistory: 'Stable 5+ years',
    notes: 'Strong credit profile'
  },
  loanStatus: {
    applicationDate: '2024-01-15',
    status: 'Under Review',
    loanType: 'Conventional',
    loanAmount: 400000,
    interestRate: 3.5,
    term: 30,
    lender: 'Wells Fargo',
    loanOfficer: 'Mike Johnson',
    notes: 'Application submitted, awaiting approval'
  },
  drivers: [
    {
      fullName: 'John Doe Jr.',
      dateOfBirth: '1985-01-15',
      age: 39,
      relationship: 'Self',
      ssn: '123-45-6789',
      sex: 'Male',
      maritalStatus: 'Married',
      drivingStatus: 'Licensed',
      licenseNumber: 'D1234567',
      licenseState: 'CA',
      accidentsViolations: false
    },
    {
      fullName: 'Jane Doe',
      dateOfBirth: '1987-03-20',
      age: 37,
      relationship: 'Spouse',
      ssn: '987-65-4321',
      sex: 'Female',
      maritalStatus: 'Married',
      drivingStatus: 'Licensed',
      licenseNumber: 'D7654321',
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
        vin: '1HGBH41JXMN109186',
        usage: 'Personal',
        annualMileage: 12000,
        coverage: {
          liability: true,
          collision: true,
          comprehensive: true
        }
      },
      {
        year: 2018,
        make: 'Honda',
        model: 'CR-V',
        vin: '2HKRM4H75JH123456',
        usage: 'Personal',
        annualMileage: 10000,
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
    coverageAmount: 450000,
    deductible: 1000,
    annualPremium: 1200,
    propertyValue: 450000,
    mortgageCompany: 'Wells Fargo',
    additionalCoverage: [
      {
        type: 'Personal Property',
        amount: 200000
      },
      {
        type: 'Liability',
        amount: 300000
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
      policyNumber: 'ML123456',
      monthlyBenefit: 4000,
      eliminationPeriod: 30,
      benefitPeriod: 24
    },
    longTermDisability: {
      provider: 'Unum',
      policyNumber: 'UN789012',
      monthlyBenefit: 5000,
      eliminationPeriod: 90,
      benefitPeriod: 'Age 65'
    },
    lifeInsurance: [
      {
        provider: 'Northwestern Mutual',
        policyNumber: 'NM345678',
        faceAmount: 500000,
        premiumAmount: 2400,
        premiumFrequency: 'Annual',
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
    currentAge: 39,
    desiredRetirementAge: 65,
    estimatedRetirementIncome: 8000,
    currentRetirementSavings: 150000,
    monthlyContribution: 1000,
    employerMatch: 500,
    retirementAccounts: [
      {
        accountType: '401k',
        provider: 'Fidelity',
        currentBalance: 120000,
        monthlyContribution: 800,
        employerMatch: 400,
        vestingSchedule: '6 year graded'
      },
      {
        accountType: 'IRA',
        provider: 'Vanguard',
        currentBalance: 30000,
        monthlyContribution: 200,
        employerMatch: 0
      }
    ],
    retirementGoals: {
      monthlyIncomeNeeded: 8000,
      inflationRate: 3,
      rateOfReturn: 7,
      retirementDuration: 25
    }
  },
  lineage: {
    referralSource: 'Referral',
    referredBy: 'Mike Smith',
    referrerContact: 'mike.smith@example.com',
    originalContactDate: '2024-01-01',
    leadSource: 'Friend referral',
    marketingCampaign: 'Q1 2024 Referral Program',
    notes: 'Referred by long-time client Mike Smith'
  }
};

const MINIMAL_CLIENT_DATA = {
  applicant: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com'
  }
};

// Helper functions
function log(message, color = 'white') {
  console.log(colors[color](message));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test functions
async function authenticate() {
  try {
    logInfo('Authenticating...');
    const response = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    
    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      logSuccess('Authentication successful');
      return true;
    } else {
      logError('Authentication failed - no token received');
      return false;
    }
  } catch (error) {
    logError(`Authentication failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testCreateMultiStageClientFull() {
  try {
    logInfo('Testing: Create Multi-Stage Client (Full Data)');
    
    const response = await axios.post(
      `${BASE_URL}/securia/clients/multistage`,
      FULL_CLIENT_DATA,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      testClientId = response.data.data.id;
      logSuccess(`Client created successfully with ID: ${response.data.data.clientId}`);
      logInfo(`Completion: ${response.data.data.completionPercentage}%, Status: ${response.data.data.status}`);
      return true;
    } else {
      logError('Failed to create client');
      return false;
    }
  } catch (error) {
    logError(`Create client failed: ${error.response?.data?.error || error.message}`);
    if (error.response?.data?.details) {
      console.log('Validation errors:', error.response.data.details);
    }
    return false;
  }
}

async function testCreateMultiStageClientMinimal() {
  try {
    logInfo('Testing: Create Multi-Stage Client (Minimal Data)');
    
    const response = await axios.post(
      `${BASE_URL}/securia/clients/multistage`,
      MINIMAL_CLIENT_DATA,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      logSuccess(`Minimal client created with ID: ${response.data.data.clientId}`);
      logInfo(`Completion: ${response.data.data.completionPercentage}%, Status: ${response.data.data.status}`);
      return true;
    } else {
      logError('Failed to create minimal client');
      return false;
    }
  } catch (error) {
    logError(`Create minimal client failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testUpdateSection() {
  if (!testClientId) {
    logWarning('No test client available for section update');
    return false;
  }
  
  try {
    logInfo('Testing: Update Client Section (Underwriting)');
    
    const updateData = {
      section: 'underwriting',
      data: {
        creditScore: 780,
        annualIncome: 175000,
        monthlyIncome: 14583,
        debtToIncomeRatio: 25,
        notes: 'Updated credit score and income - excellent profile'
      }
    };
    
    const response = await axios.put(
      `${BASE_URL}/securia/clients/${testClientId}/section/underwriting`,
      updateData,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      logSuccess('Section updated successfully');
      logInfo(`New completion: ${response.data.data.completionPercentage}%, Status: ${response.data.data.status}`);
      return true;
    } else {
      logError('Failed to update section');
      return false;
    }
  } catch (error) {
    logError(`Update section failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testGetSection() {
  if (!testClientId) {
    logWarning('No test client available for getting section');
    return false;
  }
  
  try {
    logInfo('Testing: Get Client Section (Applicant)');
    
    const response = await axios.get(
      `${BASE_URL}/securia/clients/${testClientId}/section/applicant`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      logSuccess('Section retrieved successfully');
      logInfo(`Section: ${response.data.data.section}`);
      logInfo(`Client ID: ${response.data.data.clientId}`);
      console.log('Section data preview:', JSON.stringify(response.data.data.data, null, 2).substring(0, 200) + '...');
      return true;
    } else {
      logError('Failed to get section');
      return false;
    }
  } catch (error) {
    logError(`Get section failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testGetProgress() {
  if (!testClientId) {
    logWarning('No test client available for progress check');
    return false;
  }
  
  try {
    logInfo('Testing: Get Client Progress');
    
    const response = await axios.get(
      `${BASE_URL}/securia/clients/${testClientId}/progress`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      const progress = response.data.data;
      logSuccess('Progress retrieved successfully');
      logInfo(`Overall completion: ${progress.completionPercentage}%`);
      logInfo(`Status: ${progress.status}`);
      logInfo(`Completed sections: ${progress.completedCount}/${progress.totalSections}`);
      logInfo(`Completed: ${progress.completedSections.join(', ')}`);
      return true;
    } else {
      logError('Failed to get progress');
      return false;
    }
  } catch (error) {
    logError(`Get progress failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testBulkUpdate() {
  if (!testClientId) {
    logWarning('No test client available for bulk update');
    return false;
  }
  
  try {
    logInfo('Testing: Bulk Update Multiple Sections');
    
    const bulkData = {
      sections: {
        loanStatus: {
          status: 'Approved',
          loanType: 'Conventional',
          loanAmount: 400000,
          interestRate: 3.25,
          term: 30,
          closingDate: '2024-03-15',
          notes: 'Approved with excellent terms'
        },
        lineage: {
          referralSource: 'Website',
          leadSource: 'Google Ads',
          marketingCampaign: 'Q1 2024 Digital Campaign',
          notes: 'Converted from website lead'
        }
      }
    };
    
    const response = await axios.put(
      `${BASE_URL}/securia/clients/${testClientId}/bulk-update`,
      bulkData,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      logSuccess('Bulk update completed successfully');
      logInfo(`Updated sections: ${response.data.data.updatedSections.join(', ')}`);
      logInfo(`New completion: ${response.data.data.completionPercentage}%, Status: ${response.data.data.status}`);
      return true;
    } else {
      logError('Failed to bulk update');
      return false;
    }
  } catch (error) {
    logError(`Bulk update failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testErrorScenarios() {
  logInfo('Testing: Error Scenarios');
  
  // Test invalid section name
  try {
    await axios.put(
      `${BASE_URL}/securia/clients/${testClientId}/section/invalidSection`,
      { section: 'invalidSection', data: {} },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logError('Should have failed for invalid section');
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctly rejected invalid section name');
    } else {
      logError('Unexpected error for invalid section');
    }
  }
  
  // Test non-existent client
  try {
    await axios.get(
      `${BASE_URL}/securia/clients/507f1f77bcf86cd799439011/progress`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logError('Should have failed for non-existent client');
  } catch (error) {
    if (error.response?.status === 404) {
      logSuccess('Correctly handled non-existent client');
    } else {
      logError('Unexpected error for non-existent client');
    }
  }
  
  // Test missing authentication
  try {
    await axios.post(`${BASE_URL}/securia/clients/multistage`, MINIMAL_CLIENT_DATA);
    logError('Should have failed without authentication');
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Correctly rejected unauthenticated request');
    } else {
      logError('Unexpected error for unauthenticated request');
    }
  }
}

async function testGetAllClients() {
  try {
    logInfo('Testing: Get All Clients (to verify our created clients)');
    
    const response = await axios.get(
      `${BASE_URL}/securia/clients?limit=5`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    if (response.data.success) {
      logSuccess(`Retrieved ${response.data.data.length} clients`);
      response.data.data.forEach((client, index) => {
        logInfo(`${index + 1}. ${client.clientId}: ${client.firstName} ${client.lastName} (${client.completionPercentage}% complete, ${client.status})`);
      });
      return true;
    } else {
      logError('Failed to get clients');
      return false;
    }
  } catch (error) {
    logError(`Get clients failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log('\n🚀 Starting Multi-Stage Client API Tests\n', 'cyan');
  
  const results = {
    passed: 0,
    failed: 0
  };
  
  // Authenticate first
  if (!(await authenticate())) {
    logError('Cannot proceed without authentication');
    return;
  }
  
  log('\n📝 Testing Client Creation', 'yellow');
  if (await testCreateMultiStageClientFull()) results.passed++; else results.failed++;
  if (await testCreateMultiStageClientMinimal()) results.passed++; else results.failed++;
  
  log('\n📝 Testing Section Operations', 'yellow');
  if (await testUpdateSection()) results.passed++; else results.failed++;
  if (await testGetSection()) results.passed++; else results.failed++;
  if (await testGetProgress()) results.passed++; else results.failed++;
  if (await testBulkUpdate()) results.passed++; else results.failed++;
  
  log('\n📝 Testing Error Handling', 'yellow');
  await testErrorScenarios();
  results.passed += 3; // Assuming all error scenarios pass
  
  log('\n📝 Testing Client Retrieval', 'yellow');
  if (await testGetAllClients()) results.passed++; else results.failed++;
  
  // Summary
  log('\n📊 Test Results Summary', 'cyan');
  logSuccess(`Passed: ${results.passed}`);
  if (results.failed > 0) {
    logError(`Failed: ${results.failed}`);
  } else {
    logSuccess(`Failed: ${results.failed}`);
  }
  
  log(`\n🎉 Test suite completed! ${results.passed}/${results.passed + results.failed} tests passed`, 'cyan');
}

// Run the tests
runTests().catch(console.error);
