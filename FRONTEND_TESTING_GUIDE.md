# 🧪 COMPREHENSIVE FRONTEND TESTING GUIDE

## 🚀 SETUP AND PREREQUISITES

### 1. Start the Application
```bash
# Terminal 1: Start Backend
cd backend-CRM
npm run dev

# Terminal 2: Start Frontend  
cd ..
npm run dev
```

### 2. Test User Credentials
- **Admin User**: `admin@test.com` / `admin123`
- **Regular User**: `user@test.com` / `user123`

### 3. Browser Setup
- Open: `http://localhost:5173`
- Open Developer Tools (F12)
- Monitor Network tab for API calls
- Monitor Console for errors

---

## 📊 ADMIN PANEL COMPREHENSIVE TESTING

### 🔐 Access Control Testing

#### Test 1: Admin Authentication
- [ ] Navigate to `/admin`
- [ ] Verify redirect to login if not authenticated
- [ ] Login with admin credentials
- [ ] Verify successful access to admin panel
- [ ] Check for admin-only UI elements

#### Test 2: Role-Based Access Control
- [ ] Login as non-admin user
- [ ] Try to access `/admin`
- [ ] Verify access denied message
- [ ] Check that admin routes are protected

### 🏠 Admin Dashboard Testing

#### Test 3: Dashboard Loading and Display
- [ ] Navigate to Admin → Dashboard tab
- [ ] Verify user statistics display correctly
- [ ] Check recent activity feed loads
- [ ] Test quick action buttons functionality
- [ ] Verify loading states work properly
- [ ] Check for error handling if API fails

### 👥 User Management Testing

#### Test 4: User Table Operations
- [ ] Navigate to Admin → Users tab
- [ ] Verify user table loads with data
- [ ] Test search functionality with different queries
- [ ] Test filtering by role/status
- [ ] Test pagination if applicable
- [ ] Test sorting by different columns
- [ ] Verify loading skeleton displays during data fetch

#### Test 5: User Status Management
- [ ] Test status toggle buttons (Active/Inactive)
- [ ] Verify status changes reflect immediately
- [ ] Check API calls in Network tab
- [ ] Test bulk status operations if available
- [ ] Verify status validation works correctly

#### Test 6: User Role Management
- [ ] Test role update functionality
- [ ] Verify dropdown shows all available roles
- [ ] Test role change confirmation
- [ ] Check that role changes persist
- [ ] Verify permission updates after role change

### 👤 User Creation Form Testing

#### Test 7: Multi-Stage User Creation Form
- [ ] Navigate to Admin → Create User tab
- [ ] Verify form displays correctly
- [ ] Test form validation on each field:
  - [ ] Required field validation
  - [ ] Email format validation
  - [ ] Password strength validation
  - [ ] Phone number format validation
  - [ ] Consultant ID uniqueness
- [ ] Test form submission with valid data
- [ ] Test form submission with invalid data
- [ ] Verify success/error messages display
- [ ] Test form reset functionality

#### Test 8: Form Field Interactions
- [ ] Test all dropdown selections
- [ ] Test date picker functionality
- [ ] Test text area fields
- [ ] Verify character limits work
- [ ] Test copy/paste functionality
- [ ] Check tab navigation between fields

### 🛡️ Permissions Management Testing

#### Test 9: Permission Matrix Display
- [ ] Navigate to Admin → Permissions tab
- [ ] Verify permission matrix loads correctly
- [ ] Check all roles are displayed
- [ ] Verify all pages are listed
- [ ] Test permission toggle switches
- [ ] Verify changes persist after refresh

#### Test 10: Permission Updates
- [ ] Toggle various permission combinations
- [ ] Verify API calls are made
- [ ] Check success/failure notifications
- [ ] Test bulk permission changes
- [ ] Verify permission inheritance works

---

## 🏢 SECURIA SECTION COMPREHENSIVE TESTING

### 🔐 Securia Access Control Testing

#### Test 11: Securia Access Verification
- [ ] Login as admin user
- [ ] Navigate to `/securia`
- [ ] Verify Securia dashboard loads
- [ ] Test with non-admin user (should be restricted)
- [ ] Check role-based access control works

### 🏠 Securia Dashboard Testing

#### Test 12: Dashboard Statistics and Display
- [ ] Verify consultant statistics display
- [ ] Check total/active consultant counts
- [ ] Test recent activity feed
- [ ] Verify quick action buttons work
- [ ] Test dashboard refresh functionality
- [ ] Check loading states and error handling

### 👨‍💼 Consultant Management Testing

#### Test 13: Consultant List Operations
- [ ] Navigate to `/securia/consultants`
- [ ] Verify consultant table loads properly
- [ ] Test search functionality:
  - [ ] Search by name
  - [ ] Search by consultant ID
  - [ ] Search by email
  - [ ] Search by position
- [ ] Test filtering by status/position
- [ ] Test sorting by different columns
- [ ] Verify pagination works correctly

#### Test 14: Consultant Status Management
- [ ] Test status toggle buttons
- [ ] Verify status changes reflect immediately
- [ ] Check batch status operations
- [ ] Test status confirmation dialogs
- [ ] Verify API calls and responses

### 📝 Consultant Creation Form Testing (Multi-Stage)

#### Test 15: Multi-Stage Form Navigation
- [ ] Navigate to `/securia/consultants/new`
- [ ] Verify tab-based form structure:
  - [ ] **Contact Tab**: Basic contact information
  - [ ] **Personal Tab**: Personal details
  - [ ] **CFS Information Tab**: CFS-related data
  - [ ] **Lineage Tab**: Hierarchy information
- [ ] Test navigation between tabs
- [ ] Verify form data persists across tabs
- [ ] Test tab validation states

#### Test 16: Contact Tab Testing
- [ ] **Required Fields Validation**:
  - [ ] First Name (required)
  - [ ] Last Name (required)
  - [ ] Email (required + format validation)
  - [ ] Entry Date (required)
- [ ] **Optional Fields Testing**:
  - [ ] Consultant ID
  - [ ] Middle Initial
  - [ ] Suffix
  - [ ] Position dropdown
  - [ ] Title field
  - [ ] Comment/Remarks
- [ ] **Format Validations**:
  - [ ] Email format validation
  - [ ] Phone number formats
  - [ ] Date picker functionality
- [ ] **Dropdown Testing**:
  - [ ] Position dropdown (BMA, Senior BMA, etc.)
  - [ ] Status dropdown (Active/Inactive)

#### Test 17: Personal Tab Testing
- [ ] **Personal Information Fields**:
  - [ ] Date of Birth (date picker)
  - [ ] Marital Status dropdown
  - [ ] Sex dropdown
  - [ ] Race field
  - [ ] Spouse Name
  - [ ] Anniversary date
  - [ ] Spouse Occupation
- [ ] **Education and Employment**:
  - [ ] Education Level dropdown
  - [ ] Employment Status dropdown
  - [ ] Employer field
  - [ ] Occupation field
  - [ ] Industry field
- [ ] **Identification Fields**:
  - [ ] Driver's License Number
  - [ ] Driver's License State
  - [ ] SSN field (sensitive data handling)

#### Test 18: CFS Information Tab Testing
- [ ] **CFS Details**:
  - [ ] Hire Date
  - [ ] Years with Company
  - [ ] Company Name
  - [ ] CFS Certification Date
  - [ ] Effective Date
- [ ] **Financial Information**:
  - [ ] Member Type
  - [ ] Member Amount (number validation)
  - [ ] Pay Type
  - [ ] MP Fee (number validation)
- [ ] **Status Information**:
  - [ ] CFS Status
  - [ ] Status Date
- [ ] **Tax Information**:
  - [ ] EIN field

#### Test 19: Form Validation Testing
- [ ] **Field-Level Validation**:
  - [ ] Test empty required fields
  - [ ] Test invalid email formats
  - [ ] Test invalid date formats
  - [ ] Test number field validations
  - [ ] Test character limits
- [ ] **Cross-Field Validation**:
  - [ ] Date range validations
  - [ ] Conditional field requirements
  - [ ] Business rule validations
- [ ] **Form Submission**:
  - [ ] Submit with valid data
  - [ ] Submit with invalid data
  - [ ] Test network error handling
  - [ ] Verify success/error messages

### ✏️ Consultant Editing Form Testing

#### Test 20: Edit Form Pre-population
- [ ] Navigate to edit consultant (via list action)
- [ ] Verify all tabs are pre-filled with existing data:
  - [ ] Contact information populated
  - [ ] Personal information populated  
  - [ ] CFS information populated
  - [ ] Lineage information populated
- [ ] Test that dropdowns show current values
- [ ] Verify date fields display correctly
- [ ] Check that all field values match consultant data

#### Test 21: Edit Form Updates
- [ ] Modify data in each tab
- [ ] Test validation still works in edit mode
- [ ] Submit updated form
- [ ] Verify changes persist
- [ ] Check that unchanged fields remain intact
- [ ] Test partial updates (only some fields changed)

### 🔍 Consultant Details View Testing

#### Test 22: Details Page Display
- [ ] Navigate to consultant details page
- [ ] Verify all information tabs display:
  - [ ] Main Information Section
  - [ ] Contact Tab
  - [ ] Personal Tab  
  - [ ] CFS Information Tab
- [ ] Check that all data displays correctly
- [ ] Test tab navigation
- [ ] Verify edit/action buttons work

---

## 🔍 CROSS-FUNCTIONAL TESTING

### 📱 Responsive Design Testing

#### Test 23: Mobile Responsiveness
- [ ] Test on mobile viewport (375px width)
- [ ] Verify forms adapt to small screens
- [ ] Check that tables are scrollable/responsive
- [ ] Test touch interactions
- [ ] Verify navigation menus work on mobile

#### Test 24: Tablet Responsiveness  
- [ ] Test on tablet viewport (768px width)
- [ ] Verify layout adapts appropriately
- [ ] Check form layouts are usable
- [ ] Test landscape/portrait orientations

#### Test 25: Desktop Responsiveness
- [ ] Test on various desktop resolutions
- [ ] Verify layouts use space efficiently
- [ ] Check for horizontal scrolling issues
- [ ] Test window resizing behavior

### 🔒 Security Testing

#### Test 26: Authentication Security
- [ ] Test token expiration (10-minute limit)
- [ ] Verify auto-logout on token expiry
- [ ] Test invalid token handling
- [ ] Check unauthorized access attempts
- [ ] Verify secure route protection

#### Test 27: Input Security
- [ ] Test XSS prevention in form inputs
- [ ] Check SQL injection prevention
- [ ] Test file upload security (if applicable)
- [ ] Verify data sanitization

### ⚡ Performance Testing

#### Test 28: Loading Performance
- [ ] Test initial page load times
- [ ] Check API response times
- [ ] Verify loading states display promptly
- [ ] Test large dataset handling
- [ ] Check memory usage during navigation

#### Test 29: Network Error Handling
- [ ] Test with slow network connection
- [ ] Test with intermittent connectivity
- [ ] Verify offline behavior
- [ ] Test timeout handling
- [ ] Check retry mechanisms

### ♿ Accessibility Testing

#### Test 30: Keyboard Navigation
- [ ] Test tab navigation through forms
- [ ] Verify all interactive elements are focusable
- [ ] Test keyboard shortcuts
- [ ] Check focus indicators
- [ ] Test screen reader compatibility

#### Test 31: Visual Accessibility
- [ ] Check color contrast ratios
- [ ] Test with high contrast mode
- [ ] Verify text scaling works
- [ ] Check for alt text on images
- [ ] Test with different zoom levels

---

## 📋 ERROR SCENARIOS TO TEST

### 🚨 Error Handling Testing

#### Test 32: API Error Scenarios
- [ ] **Network Errors**:
  - [ ] Simulate network disconnection
  - [ ] Test API server downtime
  - [ ] Test timeout scenarios
- [ ] **HTTP Error Codes**:
  - [ ] Test 401 Unauthorized responses
  - [ ] Test 403 Forbidden responses
  - [ ] Test 404 Not Found responses
  - [ ] Test 500 Internal Server errors
- [ ] **Validation Errors**:
  - [ ] Test server-side validation failures
  - [ ] Test constraint violations
  - [ ] Test duplicate data submissions

#### Test 33: User Experience Errors
- [ ] **Form Errors**:
  - [ ] Test incomplete form submissions
  - [ ] Test invalid data format submissions
  - [ ] Test concurrent user modifications
- [ ] **Navigation Errors**:
  - [ ] Test invalid route access
  - [ ] Test back button behavior
  - [ ] Test browser refresh during operations

---

## ✅ TESTING CHECKLIST SUMMARY

### Admin Panel Testing Complete:
- [ ] Authentication and access control
- [ ] Dashboard functionality
- [ ] User management operations
- [ ] User creation form
- [ ] Permissions management

### Securia Section Testing Complete:
- [ ] Securia access control
- [ ] Dashboard statistics
- [ ] Consultant list management
- [ ] Multi-stage consultant creation form
- [ ] Consultant editing and details

### Cross-Functional Testing Complete:
- [ ] Responsive design testing
- [ ] Security testing
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Error handling testing

---

## 🎯 SUCCESS CRITERIA

### All tests pass when:
1. **Functionality**: All features work as expected
2. **Validation**: Form validation catches errors appropriately
3. **Security**: Role-based access control works correctly
4. **Performance**: Pages load within acceptable time limits
5. **Usability**: Forms are intuitive and user-friendly
6. **Responsiveness**: UI adapts to different screen sizes
7. **Accessibility**: Interface is accessible to all users
8. **Error Handling**: Errors are handled gracefully with clear messages

### Test Documentation:
- [ ] Document any bugs found
- [ ] Record performance metrics
- [ ] Screenshot UI issues
- [ ] Note user experience improvements
- [ ] Track completion of all test cases

---

## 🔄 CONTINUOUS TESTING

Remember to re-run these tests after:
- Code changes or updates
- New feature additions
- Bug fixes
- Performance optimizations
- Security updates

This comprehensive testing approach ensures both Admin Panel and Securia sections work flawlessly across all aspects: multi-stage forms, validation, API integration, responsive design, and security.
