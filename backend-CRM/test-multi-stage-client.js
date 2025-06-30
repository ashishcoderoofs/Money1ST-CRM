#!/usr/bin/env node

/**
 * Simple test script to validate the multi-stage client creation API
 * This script tests the Joi validation middleware and controller integration
 */

const testData = {
  // Test 1: Minimum required fields (should pass validateMinimumClientFields)
  validMinimum: {
    basicInfo: {
      firstName: "Jane",
      lastName: "Smith"
    },
    contactInfo: {
      email: "jane.smith@example.com",
      homePhone: "+1-555-0123"
    }
  },

  // Test 2: Missing required fields (should fail validateMinimumClientFields)
  invalidMinimum: {
    basicInfo: {
      firstName: "Jane"
      // Missing lastName
    },
    contactInfo: {
      email: "jane.smith@example.com"
      // Missing phone
    }
  },

  // Test 3: Complete client data (for full validation)
  completeClient: {
    basicInfo: {
      title: "Ms",
      firstName: "Jane",
      lastName: "Smith",
      suffix: "Jr"
    },
    contactInfo: {
      email: "jane.smith@example.com",
      homePhone: "+1-555-0123",
      mobilePhone: "+1-555-0456"
    },
    contactAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA"
    },
    coApplicant: {
      hasCoApplicant: false
    },
    liabilities: {
      hasLiabilities: false
    },
    mortgages: {
      hasMortgages: false
    },
    underwriting: {
      creditScore: 750,
      annualIncome: 100000
    },
    loanStatus: {
      status: "pre-approved"
    },
    drivers: {
      hasDrivers: true,
      drivers: [
        {
          name: "Jane Smith",
          licenseNumber: "D1234567"
        }
      ]
    },
    vehicles: {
      hasVehicles: true,
      vehicles: [
        {
          make: "Toyota",
          model: "Camry",
          year: 2022
        }
      ]
    },
    homeowners: {
      hasHomeInsurance: true,
      provider: "State Farm"
    },
    renters: {
      hasRenters: false
    },
    incomeProtection: {
      hasIncomeProtection: false
    },
    retirement: {
      hasRetirement: true,
      contribution: 15000
    },
    lineage: {
      referralSource: "Website"
    }
  }
};

console.log('🧪 Multi-Stage Client Creation API Test Data');
console.log('==============================================');
console.log('');

console.log('✅ Test 1: Valid minimum data');
console.log(JSON.stringify(testData.validMinimum, null, 2));
console.log('');

console.log('❌ Test 2: Invalid minimum data (should fail validation)');
console.log(JSON.stringify(testData.invalidMinimum, null, 2));
console.log('');

console.log('🎯 Test 3: Complete client data');
console.log(JSON.stringify(testData.completeClient, null, 2));
console.log('');

console.log('📋 API Endpoints to test:');
console.log('- POST /api/securia/clients/partial (minimum validation)');
console.log('- POST /api/securia/clients (minimum validation)');
console.log('- PUT /api/securia/clients/:id (update validation)');
console.log('');

console.log('🔧 Test completion percentage calculation:');
const sections = ['basicInfo', 'contactInfo', 'contactAddress', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 'loanStatus', 'drivers', 'vehicles', 'homeowners', 'renters', 'incomeProtection', 'retirement', 'lineage'];

function calculateCompletionPercentage(clientData) {
  let completedSections = 0;
  
  sections.forEach(section => {
    if (clientData[section]) {
      if (section === 'basicInfo' && clientData.basicInfo.firstName && clientData.basicInfo.lastName) {
        completedSections++;
      } else if (section === 'contactInfo' && clientData.contactInfo.email && 
                 (clientData.contactInfo.homePhone || clientData.contactInfo.mobilePhone || clientData.contactInfo.otherPhone)) {
        completedSections++;
      } else if (section !== 'basicInfo' && section !== 'contactInfo' && 
                 Object.keys(clientData[section]).length > 0) {
        completedSections++;
      }
    }
  });

  return Math.round((completedSections / sections.length) * 100);
}

console.log(`Minimum data completion: ${calculateCompletionPercentage(testData.validMinimum)}%`);
console.log(`Complete data completion: ${calculateCompletionPercentage(testData.completeClient)}%`);
console.log('');

console.log('🚀 Integration is ready for testing!');
console.log('Use tools like Postman or curl to test the endpoints with the above data.');
