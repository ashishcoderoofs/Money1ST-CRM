/**
 * Create Sample Client Data for Securia API
 * Adds multiple test clients to the database
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Sample client data
const sampleClients = [
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1-555-0101',
    address: {
      street: '123 Oak Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    dateOfBirth: '1985-03-15',
    ssn: '123-45-6789',
    status: 'active',
    financialInfo: {
      annualIncome: 125000,
      netWorth: 650000,
      investmentGoals: 'Retirement planning and children education fund',
      riskTolerance: 'medium'
    }
  },
  {
    firstName: 'Robert',
    lastName: 'Smith',
    email: 'robert.smith@example.com',
    phone: '+1-555-0202',
    address: {
      street: '456 Pine Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    dateOfBirth: '1978-11-22',
    ssn: '987-65-4321',
    status: 'active',
    financialInfo: {
      annualIncome: 185000,
      netWorth: 1200000,
      investmentGoals: 'Wealth preservation and growth for early retirement',
      riskTolerance: 'high'
    }
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1-555-0303',
    address: {
      street: '789 Maple Drive',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    dateOfBirth: '1992-07-08',
    ssn: '456-78-9123',
    status: 'active',
    financialInfo: {
      annualIncome: 75000,
      netWorth: 180000,
      investmentGoals: 'First home purchase and emergency fund building',
      riskTolerance: 'low'
    }
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '+1-555-0404',
    address: {
      street: '321 Cedar Lane',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    dateOfBirth: '1980-12-03',
    ssn: '789-12-3456',
    status: 'active',
    financialInfo: {
      annualIncome: 95000,
      netWorth: 320000,
      investmentGoals: 'Business expansion and real estate investment',
      riskTolerance: 'medium'
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1-555-0505',
    address: {
      street: '654 Birch Court',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    dateOfBirth: '1987-09-17',
    ssn: '321-54-9876',
    status: 'active',
    financialInfo: {
      annualIncome: 110000,
      netWorth: 450000,
      investmentGoals: 'Diversified portfolio for long-term growth',
      riskTolerance: 'high'
    }
  },
  {
    firstName: 'David',
    lastName: 'Garcia',
    email: 'david.garcia@example.com',
    phone: '+1-555-0606',
    address: {
      street: '987 Elm Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    dateOfBirth: '1975-04-25',
    ssn: '654-32-1987',
    status: 'active',
    financialInfo: {
      annualIncome: 155000,
      netWorth: 890000,
      investmentGoals: 'Tax-efficient investments and estate planning',
      riskTolerance: 'medium'
    }
  },
  {
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer.martinez@example.com',
    phone: '+1-555-0707',
    address: {
      street: '159 Spruce Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    dateOfBirth: '1990-01-12',
    ssn: '852-96-3741',
    status: 'active',
    financialInfo: {
      annualIncome: 88000,
      netWorth: 275000,
      investmentGoals: 'Sustainable and socially responsible investing',
      riskTolerance: 'low'
    }
  },
  {
    firstName: 'Christopher',
    lastName: 'Anderson',
    email: 'christopher.anderson@example.com',
    phone: '+1-555-0808',
    address: {
      street: '753 Willow Street',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    dateOfBirth: '1982-06-30',
    ssn: '147-25-8369',
    status: 'inactive',
    financialInfo: {
      annualIncome: 135000,
      netWorth: 720000,
      investmentGoals: 'International diversification and currency hedging',
      riskTolerance: 'high'
    }
  }
];

const createSampleClients = async () => {
  console.log('🚀 Creating Sample Client Data for Securia API\n');
  
  try {
    // Login first
    console.log('🔑 Authenticating...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@money1st.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Authentication successful\n');
    
    const authHeader = { 'Authorization': `Bearer ${token}` };
    
    // Get available consultants to assign to clients
    console.log('👥 Fetching available consultants...');
    const consultantsResponse = await axios.get(`${BASE_URL}/api/securia/consultants`, {
      headers: authHeader
    });
    
    const consultants = consultantsResponse.data.data || [];
    console.log(`✅ Found ${consultants.length} consultants\n`);
    
    if (consultants.length === 0) {
      console.log('❌ No consultants found. Please create consultants first.');
      return;
    }
    
    // Create clients
    console.log('👤 Creating sample clients...\n');
    const createdClients = [];
    
    for (let i = 0; i < sampleClients.length; i++) {
      const clientData = { ...sampleClients[i] };
      
      // Assign a random consultant
      const randomConsultant = consultants[Math.floor(Math.random() * consultants.length)];
      clientData.consultantId = randomConsultant._id;
      
      try {
        const response = await axios.post(`${BASE_URL}/api/securia/clients`, clientData, {
          headers: authHeader
        });
        
        if (response.data.success) {
          const client = response.data.data;
          createdClients.push(client);
          console.log(`✅ Created: ${client.firstName} ${client.lastName}`);
          console.log(`   📧 Email: ${client.email}`);
          console.log(`   💰 Income: $${client.financialInfo.annualIncome.toLocaleString()}`);
          console.log(`   👨‍💼 Consultant: ${randomConsultant.firstName} ${randomConsultant.lastName}`);
          console.log(`   🔒 SSN: [ENCRYPTED]\n`);
        } else {
          console.log(`❌ Failed to create ${clientData.firstName} ${clientData.lastName}: ${response.data.message}`);
        }
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  Client ${clientData.firstName} ${clientData.lastName} already exists (${clientData.email})`);
        } else {
          console.log(`❌ Error creating ${clientData.firstName} ${clientData.lastName}: ${error.response?.data?.message || error.message}`);
        }
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Summary
    console.log('=' .repeat(60));
    console.log(`📊 CLIENT CREATION SUMMARY`);
    console.log('─'.repeat(60));
    console.log(`✅ Successfully created: ${createdClients.length} clients`);
    console.log(`❌ Failed/Existing: ${sampleClients.length - createdClients.length} clients`);
    
    if (createdClients.length > 0) {
      const totalIncome = createdClients.reduce((sum, c) => sum + c.financialInfo.annualIncome, 0);
      const avgIncome = totalIncome / createdClients.length;
      
      console.log(`💰 Total Annual Income: $${totalIncome.toLocaleString()}`);
      console.log(`📈 Average Annual Income: $${Math.round(avgIncome).toLocaleString()}`);
      
      const riskDistribution = createdClients.reduce((acc, c) => {
        const risk = c.financialInfo.riskTolerance;
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
      }, {});
      
      console.log(`🎯 Risk Tolerance Distribution:`);
      Object.entries(riskDistribution).forEach(([risk, count]) => {
        console.log(`   ${risk.toUpperCase()}: ${count} clients`);
      });
    }
    
    console.log('\n🎉 Sample client data creation completed!');
    console.log('💡 You can now run "node display-clients.js" to view all clients');
    
  } catch (error) {
    console.error('❌ Failed to create sample clients:', error.response?.data || error.message);
  }
};

createSampleClients();
