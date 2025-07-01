# Money1st CRM - Backend API Server

A comprehensive, production-ready Node.js/TypeScript backend server for the Money1st CRM system with JWT authentication, role-based access control, consultant management, multi-stage client forms, user status validation, and enhanced security features.

## 🌟 Current System Status

**✅ FULLY IMPLEMENTED & PRODUCTION READY**
- **Comprehensive User & Consultant Management**: Complete CRUD operations with 30+ fields
- **Advanced Security**: JWT authentication with 10-minute expiration, dual-level user status validation
- **Multi-Stage Forms**: Progressive client creation with validation and completion tracking
- **Role-Based Access Control**: 6-level hierarchy with dynamic permissions
- **Securia Integration**: Complete financial management module for Admin users
- **Audit Logging**: Comprehensive activity tracking and security monitoring
- **API Documentation**: Interactive Swagger/OpenAPI 3.0 documentation
- **File Management**: Complete attachment system with metadata
- **Enhanced Middleware**: Real-time status validation and authentication

## 🏗️ Architecture Overview

### Core Components
- **Authentication System**: JWT-based with enhanced security features
- **User Management**: Complete consultant profiles with comprehensive data
- **Consultant API**: Full CRUD operations with search and filtering
- **Multi-Stage Client Forms**: Progressive form creation with validation
- **Securia Module**: Admin-only financial management system
- **Audit System**: Complete activity logging and monitoring
- **File Attachments**: Secure file upload/download with metadata
- **Dynamic Permissions**: Database-driven role and page permissions

### Security Features
- **JWT Tokens**: 10-minute expiration for enhanced security
- **Dual-Level User Validation**: `isActive` boolean + `status` string validation
- **Real-time Status Checks**: Fresh database lookups for critical operations
- **Comprehensive Logging**: All user access and status changes logged
- **Role-Based Access**: 6-level hierarchy with dynamic permissions
- **Input Validation**: Comprehensive Joi schemas for all endpoints
- **Rate Limiting**: Protection against abuse and DoS attacks

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB 4.4+ (local or cloud)
- Git

### 1. Environment Setup
```bash
# Clone and navigate
git clone <repository>
cd backend-CRM

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Configure Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/money1st_crm

# JWT Configuration (Enhanced Security)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=10m

# Security
BCRYPT_SALT_ROUNDS=12

# Logging
LOG_LEVEL=info
```

### 3. Initialize Database
```bash
# Start MongoDB (if local)
mongod

# Bootstrap initial admin user and permissions
npm run bootstrap
```

### 4. Start Development Server
```bash
# Development mode with hot reload
npm run dev

# Production build and start
npm run build && npm start
```

### 5. Verify Installation
- **Health Check**: `GET http://localhost:3000/health`
- **API Documentation**: `http://localhost:3000/api-docs`
- **Login Test**: `POST http://localhost:3000/api/auth/login`

## 📊 API Endpoints Overview

### 🔐 Authentication (`/api/auth`)
- `POST /login` - User login with enhanced security validation
- `POST /register` - Register new user (role-based access)
- `GET /profile` - Get current user profile with status check

### 👥 User Management (`/api/users`)
- `GET /users` - List users with pagination and filtering
- `GET /users/:id` - Get user by ID with status validation
- `PUT /users/:id` - Update user with real-time status check
- `DELETE /users/:id` - Delete user (enhanced admin validation)
- `GET /users/permissions` - Get user's current page permissions

### 🏢 Consultant Management (`/api/consultants`)
- `GET /consultants` - List consultants with advanced filtering
- `POST /consultants` - Create consultant with comprehensive validation
- `GET /consultants/:id` - Get consultant details
- `PUT /consultants/:id` - Update consultant with status validation
- `DELETE /consultants/:id` - Delete consultant (admin only)
- `PATCH /consultants/:id/toggle-status` - Toggle active/inactive status
- `GET /consultants/stats` - Get consultant statistics
- `GET /consultants/search` - Advanced search functionality

### 🛡️ Admin Panel (`/api/admin`)
#### Dashboard & Analytics
- `GET /admin/dashboard/stats` - System statistics and metrics
- `GET /admin/users/activity` - User activity monitoring

#### User Management Operations
- `GET /admin/users` - Advanced user management interface
- `POST /admin/users` - Create users with validation
- `PUT /admin/users/bulk` - Bulk operations on multiple users
- `DELETE /admin/users/bulk` - Bulk delete with confirmation
- `PATCH /admin/users/:id/toggle-status` - Toggle user status
- `PATCH /admin/users/:id/role` - Change user role
- `PATCH /admin/users/:id/reset-password` - Reset user password

#### Dynamic Permissions Management
- `GET /admin/page-permissions` - Get all permission configurations
- `POST /admin/page-permissions` - Create/update permissions
- `POST /admin/page-permissions/initialize` - Initialize default permissions
- `PATCH /admin/page-permissions/:page/toggle` - Toggle role access
- `DELETE /admin/page-permissions/:page` - Remove permission rules

### 🏦 Securia Financial Management (`/api/securia`)
*Admin-only access with enhanced validation*

#### Authentication & Access
- `POST /securia/reauth` - Re-authenticate for Securia access
- `GET /securia/status` - Check Securia access status

#### Consultant Management
- `GET /securia/consultants` - List consultants with advanced filtering
- `POST /securia/consultants` - Create consultant with full validation
- `GET /securia/consultants/:id` - Get consultant details
- `PUT /securia/consultants/:id` - Update consultant
- `DELETE /securia/consultants/:id` - Delete consultant
- `PATCH /securia/consultants/:id/status` - Toggle consultant status

#### Multi-Stage Client Management
- `GET /securia/clients` - List clients with filtering and pagination
- `POST /securia/clients` - Create client with basic validation
- `POST /securia/clients/multistage` - Create client with multi-stage validation
- `GET /securia/clients/:id` - Get complete client details
- `PUT /securia/clients/:id` - Update client information
- `DELETE /securia/clients/:id` - Delete client
- `PATCH /securia/clients/:id/status` - Toggle client status

#### Progressive Form Management
- `PUT /securia/clients/:id/section/:section` - Update specific form section
- `GET /securia/clients/:id/section/:section` - Get section data
- `GET /securia/clients/:id/progress` - Get completion progress
- `PUT /securia/clients/:id/bulk-update` - Update multiple sections

#### Analytics & Reporting
- `GET /securia/dashboard/stats` - Dashboard statistics
- `GET /securia/dashboard/charts` - Chart data for analytics
- `GET /securia/audit-logs` - Activity audit logs

### 📎 File Attachment System (`/api/attachments`)
- `POST /attachments/upload` - Upload files with metadata
- `GET /attachments/:recordId/:category` - List attachments
- `GET /attachments/file/:id` - Download file
- `GET /attachments/details/:id` - Get file metadata
- `PUT /attachments/:id` - Update file metadata
- `DELETE /attachments/:id` - Delete attachment
- `GET /attachments/stats/:recordId` - Get attachment statistics

### 📋 System & Monitoring
- `GET /health` - Health check endpoint
- `GET /api-docs` - Interactive API documentation
- `GET /api-docs.json` - OpenAPI specification

## 🛡️ Enhanced Security Features

### 10-Minute JWT Token Expiration
- **Short-lived Tokens**: Reduces exposure window for compromised tokens
- **Automatic Refresh**: Frontend handles token expiration gracefully
- **Secure Logout**: Proper cleanup on token expiration
- **Enhanced Validation**: Real-time token verification

### Dual-Level User Status Validation
- **System Level**: `isActive` boolean for immediate disable
- **Business Level**: `status` string for workflow management
- **Real-time Checks**: Fresh database lookups for critical operations
- **Comprehensive Logging**: All status checks and failures logged

### Enhanced Authentication Middleware
- **Standard Auth**: Token validation with cached user data
- **Enhanced Auth**: Real-time database status validation
- **Admin Validation**: Fresh admin status checks
- **Access Logging**: Complete audit trail of user access

### Role-Based Access Control (RBAC)
```
Admin (Level 6)         - Full system access
Field Builder (Level 5) - Management capabilities
Field Trainer (Level 4) - Training and supervision
Senior BMA (Level 3)    - Senior associate privileges
BMA (Level 2)          - Standard associate access
IBA (Level 1)          - Entry-level access
```

## 📝 Data Models

### User/Consultant Model (30+ Fields)
#### Main Information
- `consultantId` - Unique identifier (required)
- `entryDate` - Date of joining (required)
- `position` - Job position/role
- `status` - Active/Inactive status
- `isActive` - System-level boolean flag
- `title` - Professional title (Mr./Ms./Dr.)
- `firstName`, `middleInitial`, `lastName`, `suffix` - Name components
- `comment`, `remarks` - Additional notes

#### Contact Information
- `email` - Primary email (required, unique)
- `maidenName` - Alternative name
- `address`, `city`, `county`, `state`, `zipCode` - Location
- `homePhone`, `mobile`, `workPhone`, `otherPhone`, `fax` - Contact numbers

#### Personal Information
- `dateOfBirth` - Birth date
- `maritalStatus` - Relationship status
- `sex` - Gender identification
- `race` - Demographic information
- `spouseName`, `anniversary`, `spouseOccupation` - Spouse details
- `educationLevel` - Education background
- `driversLicenseNumber`, `driversLicenseState` - License info
- `employmentStatus`, `employer`, `occupation`, `industry` - Employment

#### CFS Information
- `ssn`, `ein` - Tax identification
- `hireDate`, `yearsWithFrq` - Employment timeline
- `companyName` - Company affiliation
- `cfsCertificationDate`, `effectiveDate` - Certification dates
- `memberType`, `mbrAmt`, `payType` - Membership details

### Multi-Stage Client Model
#### Comprehensive Form Sections
- **Applicant Information**: Personal and contact details
- **Co-Applicant Information**: Secondary applicant data
- **Financial Liabilities**: Debt and liability information
- **Mortgage Information**: Property and mortgage details
- **Underwriting Data**: Risk assessment information
- **Loan Status**: Current loan information
- **Driver Information**: Vehicle and driver details
- **Insurance Coverage**: Various insurance types
- **Income Protection**: Disability and income insurance
- **Retirement Planning**: Retirement account information
- **Lineage Information**: Referral and relationship data

## 🧪 Testing & Quality Assurance

### Available Test Scripts
```bash
# Comprehensive API testing
npm run test:api

# User status validation tests
node scripts/test-user-status-validation.js

# JWT expiration testing
node scripts/test-jwt-expiration.js

# Multi-stage form testing
node scripts/test-multistage-api.js

# Frontend integration tests
node scripts/test-frontend-comprehensive.js

# Admin panel testing
node scripts/test-admin-panel-comprehensive.js

# Securia module testing
node scripts/test-securia-comprehensive.js
```

### Test Coverage
- **Authentication & Authorization**: Complete JWT and role testing
- **User Status Validation**: Dual-level validation scenarios
- **Multi-Stage Forms**: Progressive form creation and validation
- **API Integration**: Frontend-backend integration tests
- **Security Testing**: Token expiration and access control
- **Admin Functions**: User management and permissions
- **Securia Module**: Financial management functionality

## 📚 Documentation

### Technical Documentation
- **[USER_STATUS_VALIDATION.md](./USER_STATUS_VALIDATION.md)**: Comprehensive user status system
- **[JWT_10_MINUTE_IMPLEMENTATION.md](./JWT_10_MINUTE_IMPLEMENTATION.md)**: JWT security implementation
- **[MULTI_STAGE_CLIENT_INTEGRATION.md](./MULTI_STAGE_CLIENT_INTEGRATION.md)**: Progressive form system
- **[SECURIA_API_IMPLEMENTATION.md](./SECURIA_API_IMPLEMENTATION.md)**: Financial management module
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**: Complete API reference
- **[ATTACHMENT_SYSTEM.md](./ATTACHMENT_SYSTEM.md)**: File management system

### Testing Documentation
- **[QUICK_TESTING_GUIDE.md](../QUICK_TESTING_GUIDE.md)**: Manual testing procedures
- **[IMPLEMENTATION_SUMMARY_USER_STATUS.md](./IMPLEMENTATION_SUMMARY_USER_STATUS.md)**: Status validation summary

### Interactive Documentation
- **Swagger UI**: `http://localhost:3000/api-docs` (when server running)
- **OpenAPI Spec**: `http://localhost:3000/api-docs.json`

## 🔧 Development Tools

### Available Scripts
```bash
npm run dev          # Development with hot reload
npm run build        # TypeScript compilation
npm run start        # Production server
npm run test         # Run test suite
npm run bootstrap    # Initialize admin user and permissions
npm run clean        # Clean build directory
```

### Development Features
- **Hot Reload**: Automatic server restart on file changes
- **TypeScript**: Full type safety with strict compilation
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Logging**: Structured logging with Winston
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation with Joi schemas

## 📊 Performance & Monitoring

### Logging System
- **Winston Logger**: Structured logging with multiple transports
- **Log Levels**: Error, warn, info, debug levels
- **File Rotation**: Automatic log file management
- **Audit Trail**: Complete user activity logging

### Health Monitoring
- **Health Endpoint**: `/health` with system status
- **Performance Metrics**: Response time monitoring
- **Error Tracking**: Comprehensive error logging
- **Uptime Monitoring**: System availability tracking

### Database Optimization
- **Indexes**: Optimized MongoDB indexes for performance
- **Query Optimization**: Efficient database queries
- **Connection Pooling**: Mongoose connection management
- **Caching**: Strategic caching for improved performance

## 🚀 Production Deployment

### Deployment Checklist
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Configure production MongoDB URI
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS with proper certificates
- [ ] Configure CORS for production domains
- [ ] Set up log rotation and monitoring
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up SSL/TLS termination
- [ ] Configure backup strategies
- [ ] Set up monitoring and alerting

### Docker Support
```bash
# Build Docker image
docker build -t money1st-crm-backend .

# Run with environment file
docker run -p 3000:3000 --env-file .env money1st-crm-backend

# Docker Compose (with MongoDB)
docker-compose up -d
```

### Environment Variables
```env
# Production Configuration
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/money1st_crm

# Security
JWT_SECRET=your_production_jwt_secret_minimum_32_characters
JWT_EXPIRE=10m
BCRYPT_SALT_ROUNDS=12

# Logging
LOG_LEVEL=warn
```

## 💡 Key Features Highlights

### 🔒 Enhanced Security
- **10-minute JWT expiration** for maximum security
- **Dual-level user validation** (isActive + status)
- **Real-time status checks** for critical operations
- **Comprehensive audit logging** for all user activities

### 📝 Multi-Stage Forms
- **Progressive client creation** with validation at each step
- **Completion percentage tracking** based on filled sections
- **Section-by-section updates** for better user experience
- **Comprehensive validation** with detailed error messages

### 👥 Advanced User Management
- **6-level role hierarchy** with proper inheritance
- **Dynamic permissions system** stored in database
- **Bulk operations** for efficient user management
- **Complete audit trail** for all administrative actions

### 🏦 Securia Financial Module
- **Admin-only access** with enhanced security
- **Complete consultant management** within financial context
- **Multi-stage client forms** for comprehensive data collection
- **Analytics and reporting** for business insights

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes with proper testing
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add new feature'`
6. Push to branch: `git push origin feature/new-feature`
7. Submit pull request with detailed description

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage required
- **Documentation**: Update relevant documentation

## 📞 Support & Maintenance

### Getting Help
- **Issues**: Create GitHub issue with detailed description
- **Documentation**: Check comprehensive docs in repository
- **API Testing**: Use interactive Swagger documentation
- **Logs**: Check application logs for debugging information

### Maintenance
- **Regular Updates**: Keep dependencies up to date
- **Security Patches**: Monitor and apply security updates
- **Database Maintenance**: Regular backups and optimization
- **Log Management**: Monitor and rotate log files
- **Performance Monitoring**: Track system performance metrics

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Features**: Complete CRM Backend + Enhanced Security + Multi-Stage Forms + Securia Integration  
**Technology Stack**: Node.js + TypeScript + MongoDB + JWT + Express.js  
**Security Level**: Enterprise-Grade with 10-minute JWT expiration  
**Documentation**: Comprehensive with Interactive API Docs
