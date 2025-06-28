#!/usr/bin/env node

/**
 * Simple test script for the attachment API endpoints
 * Run with: node test-attachments.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const https = require('https');
const http = require('http');

const API_BASE = process.env.API_URL || 'http://localhost:3000';
const TEST_TOKEN = process.env.TEST_TOKEN || 'your-test-jwt-token-here';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      if (options.body instanceof FormData) {
        options.body.pipe(req);
      } else {
        req.write(options.body);
        req.end();
      }
    } else {
      req.end();
    }
  });
}

async function testAttachmentAPI() {
  console.log('🚀 Testing Attachment API endpoints...\n');

  // Test data
  const testRecordId = 'test-record-123';
  const testCategory = 'document';
  
  // Create a test file
  const testFileName = 'test-file.txt';
  const testFileContent = 'This is a test file for attachment API testing.';
  const testFilePath = path.join(__dirname, testFileName);
  
  try {
    fs.writeFileSync(testFilePath, testFileContent);
    console.log('✅ Created test file');
  } catch (error) {
    console.error('❌ Failed to create test file:', error.message);
    return;
  }

  let uploadedAttachmentId = null;

  try {
    // Test 1: Upload file
    console.log('\n📤 Testing file upload...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    formData.append('recordId', testRecordId);
    formData.append('category', testCategory);
    formData.append('description', 'Test file upload');
    formData.append('tags', JSON.stringify(['test', 'api']));

    const uploadResponse = await makeRequest(`${API_BASE}/api/attachments/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (uploadResponse.status === 201) {
      console.log('✅ Upload successful');
      uploadedAttachmentId = uploadResponse.data.attachment?.id;
      console.log('   Attachment ID:', uploadedAttachmentId);
    } else {
      console.log('❌ Upload failed:', uploadResponse.status, uploadResponse.data);
    }

    // Test 2: List attachments
    console.log('\n📋 Testing list attachments...');
    const listResponse = await makeRequest(`${API_BASE}/api/attachments/${testRecordId}/${testCategory}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (listResponse.status === 200) {
      console.log('✅ List successful');
      console.log('   Found attachments:', listResponse.data.attachments?.length || 0);
    } else {
      console.log('❌ List failed:', listResponse.status, listResponse.data);
    }

    if (uploadedAttachmentId) {
      // Test 3: Get attachment details
      console.log('\n📄 Testing get attachment details...');
      const detailsResponse = await makeRequest(`${API_BASE}/api/attachments/details/${uploadedAttachmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (detailsResponse.status === 200) {
        console.log('✅ Get details successful');
        console.log('   File name:', detailsResponse.data.originalName);
      } else {
        console.log('❌ Get details failed:', detailsResponse.status, detailsResponse.data);
      }

      // Test 4: Update attachment
      console.log('\n✏️ Testing update attachment...');
      const updateResponse = await makeRequest(`${API_BASE}/api/attachments/${uploadedAttachmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'Updated test file description',
          tags: ['test', 'api', 'updated']
        })
      });

      if (updateResponse.status === 200) {
        console.log('✅ Update successful');
      } else {
        console.log('❌ Update failed:', updateResponse.status, updateResponse.data);
      }

      // Test 5: Get statistics
      console.log('\n📊 Testing get statistics...');
      const statsResponse = await makeRequest(`${API_BASE}/api/attachments/stats/${testRecordId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.status === 200) {
        console.log('✅ Statistics successful');
        console.log('   Total attachments:', statsResponse.data.totalAttachments);
        console.log('   Total size:', statsResponse.data.totalSize, 'bytes');
      } else {
        console.log('❌ Statistics failed:', statsResponse.status, statsResponse.data);
      }

      // Test 6: Delete attachment
      console.log('\n🗑️ Testing delete attachment...');
      const deleteResponse = await makeRequest(`${API_BASE}/api/attachments/${uploadedAttachmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (deleteResponse.status === 200) {
        console.log('✅ Delete successful');
      } else {
        console.log('❌ Delete failed:', deleteResponse.status, deleteResponse.data);
      }
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    // Clean up test file
    try {
      fs.unlinkSync(testFilePath);
      console.log('\n🧹 Cleaned up test file');
    } catch (error) {
      console.log('⚠️ Could not clean up test file:', error.message);
    }
  }

  console.log('\n🏁 Test completed!\n');
  console.log('📝 Note: Make sure to:');
  console.log('   1. Start the server: npm run dev');
  console.log('   2. Set TEST_TOKEN environment variable with a valid JWT token');
  console.log('   3. Ensure the user has proper permissions');
}

// Run tests
if (require.main === module) {
  testAttachmentAPI();
}

module.exports = { testAttachmentAPI };
