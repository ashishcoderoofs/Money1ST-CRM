const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Admin credentials - will login to get fresh token
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

async function getAuthToken() {
  try {
    console.log('🔑 Getting authentication token...');
    const response = await axios.post(`${BASE_URL}/auth/login`, ADMIN_CREDENTIALS);
    console.log('✅ Successfully authenticated');
    return response.data.token;
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data?.message || error.message);
    throw new Error('Could not authenticate. Please check admin credentials and server status.');
  }
}

// Sample consultant data
const sampleConsultants = [
  {
    consultantId: 'CON-001',
    entryDate: '2024-01-15',
    position: 'Senior BMA',
    status: 'Active',
    title: 'Mr.',
    firstName: 'John',
    middleInitial: 'D',
    lastName: 'Smith',
    email: 'john.smith@money1st.com',
    mobile: '214-555-0101',
    address: '123 Main Street',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    dateOfBirth: '1985-03-15',
    maritalStatus: 'Married',
    sex: 'Male',
    spouseName: 'Jane Smith',
    educationLevel: 'Bachelor Degree',
    employmentStatus: 'Employed',
    employer: 'Money1ST',
    occupation: 'Financial Consultant',
    hireDate: '2024-01-15',
    yearsWithFrq: 1,
    comment: 'Experienced financial consultant specializing in retirement planning'
  },
  {
    consultantId: 'CON-002',
    entryDate: '2023-08-10',
    position: 'Senior BMA',
    status: 'Active',
    title: 'Ms.',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@money1st.com',
    mobile: '214-555-0102',
    address: '456 Oak Avenue',
    city: 'Plano',
    state: 'TX',
    zipCode: '75024',
    dateOfBirth: '1988-07-22',
    maritalStatus: 'Single',
    sex: 'Female',
    educationLevel: 'Master Degree',
    employmentStatus: 'Employed',
    employer: 'Money1ST',
    occupation: 'Business Management Associate',
    hireDate: '2023-08-10',
    yearsWithFrq: 1.5,
    comment: 'Top performer in client acquisition and relationship management'
  },
  {
    consultantId: 'CON-003',
    entryDate: '2023-11-01',
    position: 'BMA',
    status: 'Active',
    title: 'Mr.',
    firstName: 'Michael',
    middleInitial: 'R',
    lastName: 'Davis',
    email: 'michael.davis@money1st.com',
    mobile: '214-555-0103',
    address: '789 Pine Street',
    city: 'Irving',
    state: 'TX',
    zipCode: '75038',
    dateOfBirth: '1990-12-05',
    maritalStatus: 'Married',
    sex: 'Male',
    spouseName: 'Lisa Davis',
    educationLevel: 'Bachelor Degree',
    employmentStatus: 'Employed',
    employer: 'Money1ST',
    occupation: 'Financial Consultant',
    hireDate: '2023-11-01',
    yearsWithFrq: 1,
    comment: 'New hire with strong background in insurance and investment products'
  },
  {
    consultantId: 'CON-004',
    entryDate: '2024-02-20',
    position: 'IBA',
    status: 'Active',
    title: 'Ms.',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@money1st.com',
    mobile: '214-555-0104',
    address: '321 Elm Drive',
    city: 'Garland',
    state: 'TX',
    zipCode: '75040',
    dateOfBirth: '1992-04-18',
    maritalStatus: 'Single',
    sex: 'Female',
    educationLevel: 'Bachelor Degree',
    employmentStatus: 'Employed',
    employer: 'Money1ST',
    occupation: 'Business Management Associate',
    hireDate: '2024-02-20',
    yearsWithFrq: 0.8,
    comment: 'Recent graduate with excellent analytical skills and client service focus'
  },
  {
    consultantId: 'CON-005',
    entryDate: '2023-05-12',
    position: 'Field Trainer',
    status: 'Active',
    title: 'Mr.',
    firstName: 'Robert',
    middleInitial: 'A',
    lastName: 'Brown',
    email: 'robert.brown@money1st.com',
    mobile: '214-555-0105',
    address: '654 Maple Lane',
    city: 'Richardson',
    state: 'TX',
    zipCode: '75080',
    dateOfBirth: '1983-09-30',
    maritalStatus: 'Married',
    sex: 'Male',
    spouseName: 'Amanda Brown',
    educationLevel: 'Master Degree',
    employmentStatus: 'Employed',
    employer: 'Money1ST',
    occupation: 'Senior Financial Consultant',
    hireDate: '2023-05-12',
    yearsWithFrq: 1.6,
    comment: 'Veteran consultant with expertise in estate planning and wealth management'
  },
  {
    consultantId: 'CON-006',
    entryDate: '2024-03-01',
    position: 'Field Builder',
    status: 'Inactive',
    title: 'Ms.',
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica.martinez@money1st.com',
    mobile: '214-555-0106',
    address: '987 Cedar Court',
    city: 'Mesquite',
    state: 'TX',
    zipCode: '75149',
    dateOfBirth: '1987-11-14',
    maritalStatus: 'Divorced',
    sex: 'Female',
    educationLevel: 'Associate Degree',
    employmentStatus: 'Employed',
    employer: 'Money1ST',
    occupation: 'Financial Consultant',
    hireDate: '2024-03-01',
    yearsWithFrq: 0.7,
    comment: 'Currently on leave - excellent track record with small business clients'
  }
];

async function createTestConsultants() {
  console.log('🚀 Creating sample consultants...\n');

  let token;
  try {
    token = await getAuthToken();
  } catch (error) {
    console.error('Cannot proceed without authentication token');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < sampleConsultants.length; i++) {
    const consultant = sampleConsultants[i];
    
    try {
      console.log(`${i + 1}. Creating ${consultant.firstName} ${consultant.lastName}...`);
      
      const response = await axios.post(`${BASE_URL}/securia/consultants`, consultant, { headers });
      
      console.log(`   ✅ Success - ID: ${response.data.data._id}`);
      console.log(`   📋 Position: ${response.data.data.position || 'N/A'}`);
      console.log(`   📧 Email: ${response.data.data.email}`);
      console.log(`   📊 Status: ${response.data.data.status}\n`);
      
      successCount++;
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.response?.data?.message || error.message}`);
      if (error.response?.data?.error) {
        console.log(`   📝 Details: ${error.response.data.error}\n`);
      }
      failCount++;
    }
  }

  console.log('📊 Summary:');
  console.log(`   ✅ Successfully created: ${successCount} consultants`);
  console.log(`   ❌ Failed to create: ${failCount} consultants`);
  console.log(`   📈 Total processed: ${successCount + failCount} consultants\n`);

  if (successCount > 0) {
    console.log('🎉 Sample consultants have been created!');
    console.log('📱 You can now view them in the frontend at: /securia/consultants');
    console.log('🔍 Try searching for names like "John", "Sarah", or "Michael"');
    console.log('📊 Filter by status: Active or Inactive');
  }

  // Test the list endpoint
  try {
    console.log('\n🔍 Verifying consultant list...');
    const listResponse = await axios.get(`${BASE_URL}/securia/consultants`, { headers });
    console.log(`✅ Total consultants in system: ${listResponse.data.data.length}`);
    console.log(`📄 Current page shows: ${listResponse.data.pagination.total} total records`);
    
    // Show the newly created consultants
    const newConsultants = listResponse.data.data.filter(c => 
      sampleConsultants.some(sc => sc.email === c.email)
    );
    
    if (newConsultants.length > 0) {
      console.log('\n📋 Newly created consultants in the list:');
      newConsultants.forEach(consultant => {
        console.log(`   • ${consultant.firstName} ${consultant.lastName} (${consultant.status}) - ${consultant.position || 'No position'}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Could not verify consultant list:', error.response?.data?.message || error.message);
  }
}

// Check server status first
async function checkServerStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server is not responding. Please start the backend server:');
    console.log('   cd backend-CRM && npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🏥 Checking server status...');
  
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    return;
  }
  
  await createTestConsultants();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createTestConsultants, sampleConsultants };
