/**
 * Client Data Display Script for Securia API
 * Shows detailed client information from the API
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const displayClientData = async () => {
  console.log('👤 Securia Client Data Display\n');
  
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
    
    // Get all clients with detailed information
    console.log('📋 Fetching client data...');
    const clientsResponse = await axios.get(`${BASE_URL}/api/securia/clients?limit=20`, {
      headers: authHeader
    });
    
    const clients = clientsResponse.data.data || [];
    const pagination = clientsResponse.data.pagination || {};
    
    console.log(`\n👥 CLIENT DATABASE (${clients.length} clients found)`);
    console.log(`📄 Page ${pagination.page} of ${pagination.pages} (Total: ${pagination.total})`);
    console.log('=' .repeat(80));
    
    if (clients.length === 0) {
      console.log('No clients found in the database.');
      return;
    }
    
    clients.forEach((client, index) => {
      console.log(`\n${index + 1}. CLIENT PROFILE`);
      console.log('─'.repeat(50));
      
      // Basic Information
      console.log(`👤 Name: ${client.firstName} ${client.lastName}`);
      console.log(`📧 Email: ${client.email}`);
      console.log(`📱 Phone: ${client.phone}`);
      console.log(`🆔 Client ID: ${client._id}`);
      console.log(`📊 Status: ${client.status.toUpperCase()}`);
      
      // Address Information
      if (client.address) {
        console.log(`🏠 Address: ${client.address.street}`);
        console.log(`         ${client.address.city}, ${client.address.state} ${client.address.zipCode}`);
        console.log(`         ${client.address.country}`);
      }
      
      // Personal Information
      console.log(`🎂 Date of Birth: ${new Date(client.dateOfBirth).toLocaleDateString()}`);
      console.log(`🔒 SSN: ${client.ssn ? '[ENCRYPTED - Protected]' : '[NOT SET]'}`);
      
      // Financial Information
      if (client.financialInfo) {
        console.log(`💰 Financial Profile:`);
        console.log(`   Annual Income: $${client.financialInfo.annualIncome?.toLocaleString() || 'N/A'}`);
        console.log(`   Net Worth: $${client.financialInfo.netWorth?.toLocaleString() || 'N/A'}`);
        console.log(`   Risk Tolerance: ${client.financialInfo.riskTolerance?.toUpperCase() || 'N/A'}`);
        console.log(`   Investment Goals: ${client.financialInfo.investmentGoals || 'N/A'}`);
      }
      
      // Consultant Assignment
      console.log(`👨‍💼 Assigned Consultant ID: ${client.consultantId || 'Not Assigned'}`);
      
      // Timestamps
      console.log(`📅 Created: ${new Date(client.createdAt).toLocaleString()}`);
      console.log(`🔄 Last Updated: ${new Date(client.updatedAt).toLocaleString()}`);
    });
    
    // Summary Statistics
    console.log('\n' + '='.repeat(80));
    console.log('📊 CLIENT STATISTICS SUMMARY');
    console.log('─'.repeat(50));
    
    const activeClients = clients.filter(c => c.status === 'active').length;
    const inactiveClients = clients.filter(c => c.status === 'inactive').length;
    const totalIncome = clients.reduce((sum, c) => sum + (c.financialInfo?.annualIncome || 0), 0);
    const avgIncome = clients.length > 0 ? totalIncome / clients.length : 0;
    
    const riskDistribution = clients.reduce((acc, c) => {
      const risk = c.financialInfo?.riskTolerance || 'unknown';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`📈 Active Clients: ${activeClients}`);
    console.log(`📉 Inactive Clients: ${inactiveClients}`);
    console.log(`💵 Total Annual Income: $${totalIncome.toLocaleString()}`);
    console.log(`📊 Average Annual Income: $${Math.round(avgIncome).toLocaleString()}`);
    console.log(`🎯 Risk Tolerance Distribution:`);
    
    Object.entries(riskDistribution).forEach(([risk, count]) => {
      console.log(`   ${risk.toUpperCase()}: ${count} clients`);
    });
    
    console.log('\n✅ Client data display completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to display client data:', error.response?.data || error.message);
  }
};

displayClientData();
