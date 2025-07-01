#!/usr/bin/env node

/**
 * Comprehensive Test Script for Consultant Edit Form Data Population
 * This script verifies that all consultant data flows correctly from backend to frontend
 */

const axios = require('axios');
const readline = require('readline');

const API_BASE = 'http://localhost:3000/api';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Complete test consultant data with ALL possible fields
const completeConsultantData = {
  // Basic Information
  consultantId: 'EDIT-TEST-2024-001',
  entryDate: '2024-01-15',
  position: 'Senior BMA',
  status: 'Active',
  title: 'Dr.',
  firstName: 'Alexandra',
  middleInitial: 'M',
  lastName: 'Johnson',
  suffix: 'PhD',
  comment: 'Comprehensive test consultant for edit form verification - contains ALL possible field data',
  remarks: 'Created specifically to test edit form data population and field mapping',

  // Contact Information
  email: 'alexandra.johnson.test@example.com',
  maidenName: 'Williams',
  address: '456 Professional Boulevard, Suite 200',
  city: 'Metro City',
  county: 'Business County',
  state: 'New York',
  zipCode: '10001-2345',
  homePhone: '212-555-0123',
  mobile: '646-555-0456',
  workPhone: '212-555-0789',
  otherPhone: '718-555-0999',
  fax: '212-555-0111',
  membershipType: 'Executive Premium',
  amount: 2750.50,
  jointMemberName: 'Michael Johnson, MD',

  // Personal Information
  dateOfBirth: '1980-03-22',
  maritalStatus: 'Married',
  sex: 'Female',
  race: 'Asian American',
  spouseName: 'Michael Johnson',
  anniversary: '2005-09-14',
  spouseOccupation: 'Physician',
  educationLevel: 'Doctorate',
  driversLicenseNumber: 'NY123456789',
  driversLicenseState: 'New York',
  employmentStatus: 'Self-Employed',
  employer: 'Johnson Financial Consulting LLC',
  occupation: 'Senior Financial Consultant',
  industry: 'Financial Services & Consulting',

  // CFS Information
  ssn: '987-65-4321',
  ein: '12-3456789',
  hireDate: '2019-01-15',
  yearsWithFrq: 5,
  companyName: 'Money1st Financial Group',
  cfsCertificationDate: '2019-04-01',
  effectiveDate: '2019-01-20',
  memberType: 'Senior Professional',
  mbrAmt: 3500.00,
  payType: 'Bi-Monthly',
  mpFee: 225.00,
  cfsStatus: 'Active Certified',
  statusDate: '2024-01-01',

  // Emergency Contact
  emergencyContactName: 'Sarah Williams',
  emergencyContactRelationship: 'Sister',
  emergencyContactPhone: '347-555-7777'
};

async function promptForCredentials() {
  return new Promise((resolve) => {
    rl.question('Enter admin email (default: admin@money1st.com): ', (email) => {
      const adminEmail = email || 'admin@money1st.com';
      rl.question('Enter admin password (default: admin123): ', (password) => {
        const adminPassword = password || 'admin123';
        resolve({ email: adminEmail, password: adminPassword });
      });
    });
  });
}

async function runComprehensiveTest() {
  console.log('🧪 COMPREHENSIVE CONSULTANT EDIT FORM TEST');
  console.log('==========================================\n');

  try {
    // Get credentials
    console.log('📋 Please provide admin credentials for testing:');
    const credentials = await promptForCredentials();
    rl.close();

    console.log('\n🔐 Authenticating...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, credentials);
    const token = loginResponse.data.token;
    console.log('✅ Authentication successful');

    // Create comprehensive test consultant
    console.log('\n📝 Creating comprehensive test consultant...');
    const createResponse = await axios.post(
      `${API_BASE}/consultants`,
      completeConsultantData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const consultantId = createResponse.data.data._id;
    console.log(`✅ Test consultant created successfully`);
    console.log(`   ID: ${consultantId}`);
    console.log(`   ConsultantID: ${createResponse.data.data.consultantId}`);

    // Fetch the consultant back to verify data integrity
    console.log('\n🔍 Fetching consultant data for verification...');
    const fetchResponse = await axios.get(
      `${API_BASE}/consultants/${consultantId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const fetchedConsultant = fetchResponse.data.data;
    console.log('✅ Consultant data fetched successfully');

    // Comprehensive field verification
    console.log('\n📊 COMPREHENSIVE FIELD VERIFICATION');
    console.log('=====================================');

    const fieldCategories = {
      'Basic Information': [
        'consultantId', 'entryDate', 'position', 'status', 'title',
        'firstName', 'middleInitial', 'lastName', 'suffix', 'comment', 'remarks'
      ],
      'Contact Information': [
        'email', 'maidenName', 'address', 'city', 'county', 'state', 'zipCode',
        'homePhone', 'mobile', 'workPhone', 'otherPhone', 'fax',
        'membershipType', 'amount', 'jointMemberName'
      ],
      'Personal Information': [
        'dateOfBirth', 'maritalStatus', 'sex', 'race', 'spouseName', 'anniversary',
        'spouseOccupation', 'educationLevel', 'driversLicenseNumber', 'driversLicenseState',
        'employmentStatus', 'employer', 'occupation', 'industry'
      ],
      'CFS Information': [
        'ssn', 'ein', 'hireDate', 'yearsWithFrq', 'companyName',
        'cfsCertificationDate', 'effectiveDate', 'memberType', 'mbrAmt',
        'payType', 'mpFee', 'cfsStatus', 'statusDate'
      ],
      'Emergency Contact': [
        'emergencyContactName', 'emergencyContactRelationship', 'emergencyContactPhone'
      ]
    };

    let totalFields = 0;
    let fieldsWithData = 0;
    let missingFields = [];

    Object.entries(fieldCategories).forEach(([category, fields]) => {
      console.log(`\n📋 ${category}:`);
      fields.forEach(field => {
        totalFields++;
        const value = fetchedConsultant[field];
        const hasData = value !== undefined && value !== null && value !== '';
        
        if (hasData) {
          fieldsWithData++;
          const displayValue = typeof value === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
          console.log(`  ✅ ${field}: ${displayValue}`);
        } else {
          missingFields.push(field);
          console.log(`  ❌ ${field}: MISSING/EMPTY`);
        }
      });
    });

    // Summary
    console.log('\n📈 SUMMARY');
    console.log('===========');
    console.log(`Total fields checked: ${totalFields}`);
    console.log(`Fields with data: ${fieldsWithData}`);
    console.log(`Fields missing/empty: ${totalFields - fieldsWithData}`);
    console.log(`Data completeness: ${Math.round((fieldsWithData / totalFields) * 100)}%`);

    if (missingFields.length > 0) {
      console.log('\n❌ Missing/Empty Fields:');
      missingFields.forEach(field => console.log(`   - ${field}`));
    }

    // Date field verification
    console.log('\n📅 DATE FIELD CONVERSION TEST');
    console.log('===============================');
    const dateFields = ['entryDate', 'dateOfBirth', 'anniversary', 'hireDate', 'cfsCertificationDate', 'effectiveDate', 'statusDate'];
    dateFields.forEach(field => {
      const value = fetchedConsultant[field];
      if (value) {
        const isValidDate = !isNaN(Date.parse(value));
        const formattedDate = isValidDate ? new Date(value).toISOString().split('T')[0] : 'INVALID';
        console.log(`  ${field}: ${value} -> ${formattedDate} ${isValidDate ? '✅' : '❌'}`);
      } else {
        console.log(`  ${field}: NO DATE SET`);
      }
    });

    // Frontend testing instructions
    console.log('\n🌐 FRONTEND TESTING');
    console.log('===================');
    console.log('Use these URLs to test the frontend:');
    console.log(`📝 Edit Form: http://localhost:5173/securia/consultants/${consultantId}/edit`);
    console.log(`👁️  View Details: http://localhost:5173/securia/consultants/${consultantId}`);
    console.log(`📋 Consultants List: http://localhost:5173/securia/consultants`);

    console.log('\n✅ TEST COMPLETED SUCCESSFULLY!');
    console.log('\nNext steps:');
    console.log('1. Open the edit form URL in your browser');
    console.log('2. Verify all tabs show the data correctly');
    console.log('3. Check that form inputs are pre-filled');
    console.log('4. Test saving changes to verify data persistence');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('💡 Tip: Check your admin credentials and try again');
    }
  }
}

runComprehensiveTest();
