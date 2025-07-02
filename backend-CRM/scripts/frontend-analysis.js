#!/usr/bin/env node

/**
 * FRONTEND COMPONENT ANALYSIS AND TESTING GUIDE
 * Comprehensive analysis of Admin Panel and Securia frontend components
 */

const fs = require('fs');
const path = require('path');
const colors = require('colors');

// Define the frontend components to analyze
const adminComponents = [
  'src/pages/Admin.tsx',
  'src/components/admin/AdminDashboard.tsx',
  'src/components/admin/AdminUsersTable.tsx',
  'src/components/admin/AdminUserCreation.tsx',
  'src/components/admin/PagePermissionsManager.tsx'
];

const securiaComponents = [
  'src/pages/Securia.tsx',
  'src/pages/Consultants.tsx',
  'src/pages/NewConsultant.tsx',
  'src/pages/EditConsultant.tsx',
  'src/pages/ConsultantDetails.tsx',
  'src/components/ConsultantFormApi.tsx'
];

const componentAnalysis = {
  multiStageForm: [],
  validation: [],
  apiIntegration: [],
  stateManagement: [],
  errorHandling: [],
  accessControl: []
};

function analyzeComponent(filePath) {
  const fullPath = path.join('d:', 'Projects', 'ExternalGit', 'Money1ST-CRM', filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { exists: false, content: null };
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  
  const analysis = {
    exists: true,
    content: content,
    features: {
      hasMultiStageForm: content.includes('useState') && (content.includes('step') || content.includes('stage') || content.includes('currentStep')),
      hasValidation: content.includes('validation') || content.includes('error') || content.includes('isValid'),
      hasApiIntegration: content.includes('useQuery') || content.includes('useMutation') || content.includes('axios') || content.includes('fetch'),
      hasStateManagement: content.includes('useState') || content.includes('useReducer') || content.includes('useContext'),
      hasErrorHandling: content.includes('try') || content.includes('catch') || content.includes('error'),
      hasAccessControl: content.includes('useAuth') || content.includes('role') || content.includes('permission'),
      hasFormHandling: content.includes('useForm') || content.includes('onSubmit') || content.includes('handleSubmit'),
      hasLoadingStates: content.includes('loading') || content.includes('isLoading') || content.includes('pending'),
      hasResponsiveDesign: content.includes('responsive') || content.includes('mobile') || content.includes('tablet') || content.includes('grid'),
      hooks: extractHooks(content),
      components: extractComponents(content),
      imports: extractImports(content)
    }
  };

  return analysis;
}

function extractHooks(content) {
  const hookPattern = /use[A-Z][a-zA-Z]*/g;
  const matches = content.match(hookPattern) || [];
  return [...new Set(matches)];
}

function extractComponents(content) {
  const componentPattern = /<([A-Z][a-zA-Z]*)/g;
  const matches = content.match(componentPattern) || [];
  return [...new Set(matches.map(match => match.replace('<', '')))];
}

function extractImports(content) {
  const importPattern = /import.*from.*['"](.*)['"]/g;
  const matches = [];
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function analyzeMultiStageForm(content) {
  const stages = [];
  
  // Look for step/stage definitions
  const stepPattern = /step\s*[=:]\s*(\d+)|stage\s*[=:]\s*(\d+)|currentStep\s*[=:]\s*(\d+)/g;
  let match;
  while ((match = stepPattern.exec(content)) !== null) {
    stages.push(match[1] || match[2] || match[3]);
  }

  const hasStepNavigation = content.includes('nextStep') || content.includes('prevStep') || content.includes('goToStep');
  const hasStepValidation = content.includes('validateStep') || content.includes('stepValid');
  const hasProgressIndicator = content.includes('progress') || content.includes('Progress');

  return {
    stages: stages.length,
    hasNavigation: hasStepNavigation,
    hasValidation: hasStepValidation,
    hasProgress: hasProgressIndicator
  };
}

function generateComponentReport(componentPath, analysis) {
  console.log(`\n📄 ${componentPath}`.cyan.bold);
  console.log('=' .repeat(60));

  if (!analysis.exists) {
    console.log('❌ Component not found'.red);
    return;
  }

  const features = analysis.features;
  
  console.log('🔍 COMPONENT ANALYSIS:'.yellow);
  console.log(`  Multi-stage Form: ${features.hasMultiStageForm ? '✅' : '❌'}`);
  console.log(`  Validation: ${features.hasValidation ? '✅' : '❌'}`);
  console.log(`  API Integration: ${features.hasApiIntegration ? '✅' : '❌'}`);
  console.log(`  State Management: ${features.hasStateManagement ? '✅' : '❌'}`);
  console.log(`  Error Handling: ${features.hasErrorHandling ? '✅' : '❌'}`);
  console.log(`  Access Control: ${features.hasAccessControl ? '✅' : '❌'}`);
  console.log(`  Form Handling: ${features.hasFormHandling ? '✅' : '❌'}`);
  console.log(`  Loading States: ${features.hasLoadingStates ? '✅' : '❌'}`);

  if (features.hooks.length > 0) {
    console.log(`\n🪝 HOOKS USED: ${features.hooks.join(', ')}`);
  }

  if (features.components.length > 0) {
    console.log(`\n🧩 COMPONENTS: ${features.components.slice(0, 10).join(', ')}${features.components.length > 10 ? '...' : ''}`);
  }

  // Multi-stage form analysis
  if (features.hasMultiStageForm) {
    const formAnalysis = analyzeMultiStageForm(analysis.content);
    console.log('\n📝 MULTI-STAGE FORM ANALYSIS:'.green);
    console.log(`  Stages detected: ${formAnalysis.stages}`);
    console.log(`  Navigation: ${formAnalysis.hasNavigation ? '✅' : '❌'}`);
    console.log(`  Step validation: ${formAnalysis.hasValidation ? '✅' : '❌'}`);
    console.log(`  Progress indicator: ${formAnalysis.hasProgress ? '✅' : '❌'}`);
  }
}

function analyzeAdminPanel() {
  console.log('\n📊 ADMIN PANEL COMPONENT ANALYSIS'.cyan.bold);
  console.log('=' .repeat(80));

  adminComponents.forEach(componentPath => {
    const analysis = analyzeComponent(componentPath);
    generateComponentReport(componentPath, analysis);
  });
}

function analyzeSecuriaSection() {
  console.log('\n🏢 SECURIA SECTION COMPONENT ANALYSIS'.cyan.bold);
  console.log('=' .repeat(80));

  securiaComponents.forEach(componentPath => {
    const analysis = analyzeComponent(componentPath);
    generateComponentReport(componentPath, analysis);
  });
}

function generateFrontendTestingGuide() {
  console.log('\n🎯 FRONTEND TESTING GUIDE'.green.bold);
  console.log('=' .repeat(80));

  console.log('\n📊 ADMIN PANEL TESTING CHECKLIST:'.cyan.bold);
  console.log('□ Admin login and authentication');
  console.log('□ Admin dashboard loading and stats display');
  console.log('□ User management table (list, search, filter)');
  console.log('□ User creation form (multi-stage)');
  console.log('  □ Basic information stage');
  console.log('  □ Contact information stage');
  console.log('  □ Role and permissions stage');
  console.log('  □ Form validation on each stage');
  console.log('  □ Stage navigation (next/prev)');
  console.log('  □ Progress indicator');
  console.log('□ User editing and status management');
  console.log('□ Page permissions management');
  console.log('  □ Permission matrix display');
  console.log('  □ Role permission toggles');
  console.log('  □ Permission updates');
  console.log('□ Error handling and loading states');
  console.log('□ Role-based access control');
  console.log('□ Responsive design testing');

  console.log('\n🏢 SECURIA SECTION TESTING CHECKLIST:'.cyan.bold);
  console.log('□ Securia access control (admin only)');
  console.log('□ Securia dashboard loading');
  console.log('  □ Consultant stats display');
  console.log('  □ Recent activity feed');
  console.log('  □ Quick action buttons');
  console.log('□ Consultant list and management');
  console.log('  □ Consultant table display');
  console.log('  □ Search and filtering');
  console.log('  □ Status toggles');
  console.log('  □ Actions menu');
  console.log('□ Consultant creation form (multi-stage)');
  console.log('  □ Basic information stage');
  console.log('  □ Contact information stage');
  console.log('  □ Personal information stage');
  console.log('  □ CFS information stage');
  console.log('  □ Financial information stage');
  console.log('  □ Form validation on each stage');
  console.log('  □ Stage navigation and progress');
  console.log('  □ Date picker functionality');
  console.log('  □ Dropdown selections');
  console.log('□ Consultant editing form (pre-filled)');
  console.log('  □ All stages pre-populated with data');
  console.log('  □ Form updates and validation');
  console.log('  □ Status management');
  console.log('□ Consultant details view');
  console.log('  □ All information tabs');
  console.log('  □ Contact information tab');
  console.log('  □ Personal information tab');
  console.log('  □ CFS information tab');
  console.log('□ Error handling and loading states');
  console.log('□ Responsive design testing');

  console.log('\n🧪 TESTING SCENARIOS:'.yellow.bold);
  console.log('\n1. AUTHENTICATION TESTING:');
  console.log('   - Admin login/logout');
  console.log('   - Token expiration handling');
  console.log('   - Unauthorized access attempts');

  console.log('\n2. FORM TESTING:');
  console.log('   - Multi-stage form progression');
  console.log('   - Form validation (client-side)');
  console.log('   - Error message display');
  console.log('   - Form submission and API calls');
  console.log('   - Form reset and cancellation');

  console.log('\n3. DATA MANAGEMENT:');
  console.log('   - CRUD operations');
  console.log('   - Real-time updates');
  console.log('   - Data persistence');
  console.log('   - Search and filtering');

  console.log('\n4. UI/UX TESTING:');
  console.log('   - Loading states and spinners');
  console.log('   - Success/error notifications');
  console.log('   - Responsive design');
  console.log('   - Accessibility compliance');

  console.log('\n5. SECURITY TESTING:');
  console.log('   - Role-based access control');
  console.log('   - Status validation');
  console.log('   - Token expiration handling');
  console.log('   - Unauthorized action prevention');
}

function generateManualTestingSteps() {
  console.log('\n📋 MANUAL TESTING STEPS'.green.bold);
  console.log('=' .repeat(80));

  console.log('\n🚀 SETUP:'.cyan.bold);
  console.log('1. Start backend server: cd backend-CRM && npm run dev');
  console.log('2. Start frontend server: npm run dev');
  console.log('3. Open browser to http://localhost:5173');
  console.log('4. Login with admin credentials');

  console.log('\n📊 ADMIN PANEL TESTING:'.cyan.bold);
  console.log('1. Navigate to /admin');
  console.log('2. Verify admin access control');
  console.log('3. Test Dashboard tab:');
  console.log('   - User statistics display');
  console.log('   - Recent activity feed');
  console.log('   - Quick action buttons');
  console.log('4. Test Users tab:');
  console.log('   - User table loading');
  console.log('   - Search functionality');
  console.log('   - Status toggles');
  console.log('   - Edit user actions');
  console.log('5. Test Create User tab:');
  console.log('   - Multi-stage form display');
  console.log('   - Form validation messages');
  console.log('   - Stage navigation');
  console.log('   - Progress indicator');
  console.log('   - Form submission');
  console.log('6. Test Permissions tab:');
  console.log('   - Permission matrix display');
  console.log('   - Role permission toggles');
  console.log('   - Permission updates');

  console.log('\n🏢 SECURIA TESTING:'.cyan.bold);
  console.log('1. Navigate to /securia');
  console.log('2. Verify Securia access control');
  console.log('3. Test Dashboard:');
  console.log('   - Consultant statistics');
  console.log('   - Recent activity');
  console.log('   - Quick actions');
  console.log('4. Navigate to /securia/consultants');
  console.log('5. Test Consultant List:');
  console.log('   - Table display');
  console.log('   - Search functionality');
  console.log('   - Status toggles');
  console.log('   - Action buttons');
  console.log('6. Test /securia/consultants/new:');
  console.log('   - Multi-stage form display');
  console.log('   - Stage 1: Basic Information');
  console.log('   - Stage 2: Contact Information');
  console.log('   - Stage 3: Personal Information');
  console.log('   - Stage 4: CFS Information');
  console.log('   - Stage 5: Financial Information');
  console.log('   - Form validation on each stage');
  console.log('   - Stage navigation');
  console.log('   - Progress indicator');
  console.log('   - Form submission');
  console.log('7. Test consultant editing:');
  console.log('   - Pre-filled form data');
  console.log('   - All stages populated');
  console.log('   - Form updates');
  console.log('   - Status management');

  console.log('\n🔍 VALIDATION TESTING:'.yellow.bold);
  console.log('1. Test with invalid inputs');
  console.log('2. Test with missing required fields');
  console.log('3. Test with incorrect data formats');
  console.log('4. Verify error message display');
  console.log('5. Test form reset functionality');

  console.log('\n📱 RESPONSIVE TESTING:'.yellow.bold);
  console.log('1. Desktop view (1920x1080)');
  console.log('2. Tablet view (768x1024)');
  console.log('3. Mobile view (375x667)');
  console.log('4. Test form layouts on different screens');
  console.log('5. Verify navigation menus');

  console.log('\n🔐 SECURITY TESTING:'.yellow.bold);
  console.log('1. Test unauthorized access attempts');
  console.log('2. Test role-based restrictions');
  console.log('3. Test token expiration handling');
  console.log('4. Test status validation');
}

async function runFrontendAnalysis() {
  console.log('🔍 STARTING FRONTEND COMPONENT ANALYSIS...'.rainbow.bold);
  console.log('=' .repeat(80));

  try {
    analyzeAdminPanel();
    analyzeSecuriaSection();
    generateFrontendTestingGuide();
    generateManualTestingSteps();

    console.log('\n🎉 FRONTEND ANALYSIS COMPLETED!'.green.bold);
    console.log('Use the testing guide above to manually test the frontend components.'.cyan);
    
  } catch (error) {
    console.log('\n💥 FRONTEND ANALYSIS FAILED:'.red.bold, error.message);
    console.log('Stack trace:', error.stack);
  }
}

// Run the analysis
if (require.main === module) {
  runFrontendAnalysis();
}

module.exports = {
  runFrontendAnalysis,
  analyzeComponent,
  adminComponents,
  securiaComponents
};
