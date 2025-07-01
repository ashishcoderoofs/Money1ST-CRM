const fetch = require('node-fetch');

async function testClientCreation() {
  const baseURL = 'http://localhost:3000/api';
  
  // Login first
  const loginResponse = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@money1st.com',
      password: 'admin123'
    })
  });
  
  const loginData = await loginResponse.json();
  const token = loginData.token;
  
  console.log('Login successful, testing client creation...');
  
  // Create consultant first
  const randomId = Math.random().toString(36).substring(7);
  const consultantResponse = await fetch(`${baseURL}/securia/consultants`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'Consultant',
      email: `test.consultant.${randomId}@example.com`,
      phone: '+1-555-9999',
      specialization: 'Test Specialization',
      experience: 'Test experience',
      certifications: ['TEST'],
      status: 'active'
    })
  });
  
  const consultantData = await consultantResponse.json();
  console.log('Consultant response:', JSON.stringify(consultantData, null, 2));
  
  if (!consultantData.success || !consultantData.data) {
    console.error('Failed to create consultant');
    return;
  }
  
  const consultantId = consultantData.data._id;
  
  console.log('Consultant created:', consultantId);
  
  // Create client
  const clientResponse = await fetch(`${baseURL}/securia/clients`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'Client',
      email: `test.client.${randomId}@example.com`,
      phone: '+1-555-8888',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      },
      dateOfBirth: '1990-01-01',
      ssn: '123-45-6789',
      consultantId: consultantId,
      financialInfo: {
        annualIncome: 50000,
        netWorth: 100000,
        investmentGoals: 'Test goals',
        riskTolerance: 'medium'
      },
      status: 'active'
    })
  });
  
  const clientData = await clientResponse.json();
  
  console.log('Client Response Status:', clientResponse.status);
  console.log('Client Response:', JSON.stringify(clientData, null, 2));
}

testClientCreation().catch(console.error);
