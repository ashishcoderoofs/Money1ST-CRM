const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test consultant data with all fields
const fullConsultantData = {
  // Basic Information
  consultantId: 'TEST-EDIT-001',
  entryDate: '2024-01-15',
  position: 'BMA',
  status: 'Active',
  title: 'Mr.',
  firstName: 'John',
  middleInitial: 'D',
  lastName: 'Smith',
  suffix: 'Jr.',
  comment: 'Test consultant for edit form verification',
  remarks: 'Created for testing purposes',

  // Contact Information
  email: 'john.smith.edit@test.com',
  maidenName: 'Johnson',
  address: '123 Test Street',
  city: 'Test City',
  county: 'Test County',
  state: 'Test State',
  zipCode: '12345',
  homePhone: '555-1234',
  mobile: '555-5678',
  workPhone: '555-9999',
  otherPhone: '555-0000',
  fax: '555-1111',
  membershipType: 'Premium',
  amount: 1500.00,
  jointMemberName: 'Jane Smith',

  // Personal Information
  dateOfBirth: '1985-06-15',
  maritalStatus: 'Married',
  sex: 'Male',
  race: 'Caucasian',
  spouseName: 'Jane Smith',
  anniversary: '2010-08-20',
  spouseOccupation: 'Teacher',
  educationLevel: 'Bachelor Degree',
  driversLicenseNumber: 'DL123456789',
  driversLicenseState: 'Test State',
  employmentStatus: 'Employed',
  employer: 'Test Corporation',
  occupation: 'Business Manager',
  industry: 'Finance',

  // CFS Information
  ssn: '123-45-6789',
  ein: '98-7654321',
  hireDate: '2020-03-01',
  yearsWithFrq: 4,
  companyName: 'Test Financial Services',
  cfsCertificationDate: '2020-06-01',
  effectiveDate: '2020-03-15',
  memberType: 'Professional',
  mbrAmt: 2500.00,
  payType: 'Monthly',
  mpFee: 150.00,
  cfsStatus: 'Active',
  statusDate: '2024-01-01',

  // Emergency Contact
  emergencyContactName: 'Mary Johnson',
  emergencyContactRelationship: 'Mother',
  emergencyContactPhone: '555-2222'
};

async function createTestConsultant() {
  try {
    // First, get auth token (you may need to adjust this based on your auth system)
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@money1st.com', // Replace with valid admin credentials
      password: 'admin123' // Replace with valid admin password
    });

    const token = loginResponse.data.token;

    // Create consultant
    const response = await axios.post(
      `${API_BASE}/consultants`,
      fullConsultantData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Test consultant created successfully!');
    console.log('ID:', response.data.data._id);
    console.log('ConsultantID:', response.data.data.consultantId);
    
    // Now fetch the consultant to verify all data is stored
    const fetchResponse = await axios.get(
      `${API_BASE}/consultants/${response.data.data._id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('\n📊 Consultant data verification:');
    const consultant = fetchResponse.data.data;
    
    // Check all major fields
    const fieldsToCheck = [
      'firstName', 'lastName', 'email', 'position', 'status',
      'entryDate', 'dateOfBirth', 'hireDate', 'cfsCertificationDate',
      'address', 'city', 'state', 'zipCode', 'mobile',
      'maritalStatus', 'sex', 'spouseName', 'employmentStatus',
      'ssn', 'companyName', 'cfsStatus', 'emergencyContactName'
    ];

    fieldsToCheck.forEach(field => {
      const value = consultant[field];
      if (value !== undefined && value !== null && value !== '') {
        console.log(`✅ ${field}: ${value}`);
      } else {
        console.log(`❌ ${field}: MISSING`);
      }
    });

    console.log('\n🔗 Use this URL to test the edit form:');
    console.log(`http://localhost:5173/securia/consultants/${response.data.data._id}/edit`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createTestConsultant();
