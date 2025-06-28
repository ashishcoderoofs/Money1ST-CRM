# Money1st CRM Nexus - Backend API

A comprehensive TypeScript Node.js backend server for Money1st CRM system with JWT authentication, role-based access control (RBAC), complete consultant management features, **file attachment system**, **page access permissions**, and **interactive Swagger/OpenAPI documentation**.

## ✅ Current Status

**✅ FULLY IMPLEMENTED & TESTED**
- Complete user model with 30+ consultant fields
- 6-level role hierarchy with proper access control
- JWT authentication with secure password hashing
- Comprehensive validation using Joi schemas
- All CRUD operations for user management
- Admin dashboard with bulk operations
- **🆕 File Attachment System**: Complete file upload/download with metadata
- **🆕 Page Access Permissions**: Granular page-level access control by role
- **🆕 Interactive Swagger/OpenAPI 3.0 documentation**
- **🆕 Advanced admin endpoints for complete user management**
- **🆕 Updated role hierarchy (Admin > Field Builder > Field Trainer > Sr. BMA > BMA > IBA)**
- TypeScript compilation without errors
- Production-ready logging and error handling

## 🌟 Features

### Core Features
- **Comprehensive User Management**: Complete consultant profiles with 30+ fields
- **Authentication & Authorization**: JWT-based authentication with 6-level role hierarchy
- **Advanced RBAC**: Fine-grained role-based access control system
- **🆕 File Attachment System**: Upload, download, and manage files with metadata
- **🆕 Page Access Permissions**: Control access to specific pages by user role
- **🆕 Interactive API Documentation**: Swagger/OpenAPI 3.0 with testing capabilities
- **🆕 Advanced Admin Panel**: Complete user management with bulk operations

### Technical Features
- **Security**: Rate limiting, CORS, Helmet security headers, password hashing
- **Validation**: Comprehensive request validation using Joi
- **Logging**: Production-ready logging with Winston
- **TypeScript**: Full TypeScript support with strict type checking
- **MongoDB Integration**: Mongoose ODM with proper schema validation
- **File Storage**: Local file system with organized directory structure
- **Middleware**: Reusable validation and authentication middleware

## � API Documentation

**🔗 Interactive Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

- **Swagger UI**: Professional, interactive API documentation
- **Try it Out**: Test all endpoints directly from the browser
- **Authentication**: Built-in JWT token authentication
- **Schema Validation**: Complete request/response examples
- **Role-Based Access**: Clear permission requirements for each endpoint

## �👥 Role Hierarchy & Permissions

### **🆕 Updated Role Levels (Most to Least Privileges)**
1. **Admin** (Level 6) - System administrators with full access
2. **Field Builder** (Level 5) - Senior consultants with management capabilities
3. **Field Trainer** (Level 4) - Training specialists and supervisors
4. **Sr. BMA** (Level 3) - Senior Business Management Associates
5. **BMA** (Level 2) - Business Management Associates
6. **IBA** (Level 1) - Independent Business Associates (entry level)

### Permission Matrix

| Role | View Users | Edit Users | Delete Users | Create Users | Bulk Operations | Admin Dashboard | Role Changes |
|------|------------|------------|--------------|--------------|-----------------|-----------------|--------------|
| Admin | All | All | All | All | ✅ | ✅ | ✅ |
| Field Builder | Lower levels | Lower levels | ❌ | ❌ | ❌ | ❌ | ❌ |
| Field Trainer | Lower levels | Lower levels | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sr. BMA | Lower levels | Lower levels | ❌ | ❌ | ❌ | ❌ | ❌ |
| BMA | Lower levels | Lower levels | ❌ | ❌ | ❌ | ❌ | ❌ |
| IBA | Lower levels | Lower levels | ❌ | ❌ | ❌ | ❌ | ❌ |

## 📊 User Information Structure

### Main Information
- **Consultant ID** (Unique identifier - required)
- **Entry Date** (Date of joining - required)
- **Position** (Job position)
- **Status** (Active/Inactive)
- **Title** (Professional title)
- **Name** (First Name, Middle Initial, Last Name, Suffix)
- **Comments & Remarks** (Additional notes)

### Contact Information
- **Email** (Primary communication - required & unique)
- **Address** (Full address: Street, City, County, State, Zip)
- **Phone Numbers** (Home, Mobile, Work, Other, Fax)

### CFS Information
- **Membership Type** (Type of membership)
- **Membership Amount** (Financial amount)
- **Joint Member Name** (Associated member)

### Additional Fields
- **Maiden/Other Names** (Alternative names used)

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### 1. Environment Configuration
Create `.env` file in backend directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/money1st_crm

# JWT Configuration  
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Security
BCRYPT_SALT_ROUNDS=12

# Logging
LOG_LEVEL=info
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Development Setup
```bash
# Run in development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run in production mode
npm start

# Run tests
npm test
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/           # Business logic
│   │   ├── authController.ts     # Authentication & registration
│   │   ├── userController.ts     # User CRUD operations  
│   │   ├── adminController.ts    # Admin operations
│   │   ├── attachmentController.ts # File attachment management
│   │   └── pagePermissionController.ts # Page access permissions
│   ├── middleware/            # Custom middleware
│   │   ├── auth.ts              # JWT authentication & RBAC
│   │   ├── validation.ts        # Input validation (Joi)
│   │   ├── paramValidation.ts   # Parameter validation helpers
│   │   ├── upload.ts           # File upload middleware (Multer)
│   │   └── errorHandler.ts      # Global error handling
│   ├── models/               # Database schemas
│   │   ├── User.ts              # Complete user/consultant model
│   │   ├── Attachment.ts        # File attachment metadata
│   │   └── PagePermission.ts    # Page access permissions
│   ├── routes/               # API route definitions
│   │   ├── authRoutes.ts        # Auth endpoints
│   │   ├── userRoutes.ts        # User management
│   │   ├── adminRoutes.ts       # Admin functions
│   │   └── attachmentRoutes.ts  # File attachment endpoints
│   ├── config/               # Configuration
│   │   └── swagger.ts           # Swagger/OpenAPI setup
│   ├── types/                # TypeScript definitions
│   │   └── index.ts             # Interfaces & types
│   └── utils/                # Utility functions
│       └── logger.ts            # Winston logging setup
├── uploads/                  # File storage directory
│   ├── note/                   # Note attachments
│   ├── contact/                # Contact files
│   ├── deal/                   # Deal documents
│   ├── client/                 # Client files
│   ├── document/               # General documents
│   ├── image/                  # Image files
│   └── other/                  # Miscellaneous files
├── utils/
│   └── logger.ts             # Shared logging utility
├── logs/                     # Log files
├── docker/                   # Docker configuration
│   └── docker-compose.yml      # Docker Compose setup
├── server.ts                 # Application entry point
├── bootstrap.ts              # Database initialization
├── .env                      # Environment variables
├── .gitignore               # Git ignore patterns
├── tsconfig.json            # TypeScript configuration
├── nodemon.json             # Development auto-reload
├── package.json             # Dependencies & scripts
├── README.md                # This file
├── API_DOCUMENTATION.md     # Detailed API documentation
├── ATTACHMENT_SYSTEM.md     # File attachment system guide
└── PAGE_PERMISSIONS_GUIDE.md # Page permissions implementation guide
```

## 📝 Usage Examples

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@money1st.com",
    "password": "admin123"
  }'

# Get Profile
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### User Management
```bash
# List Users (with filtering)
curl -X GET "http://localhost:3000/api/users?page=1&limit=10&role=Field Builder&search=john" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create New Consultant (Admin)
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "consultantId": "CON008",
    "entryDate": "2025-06-27",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@money1st.com",
    "password": "securepass123",
    "role": "Field Builder",
    "mobile": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }'
```

### File Attachments
```bash
# Upload a file with metadata
curl -X POST http://localhost:3000/api/attachments/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@document.pdf" \
  -F "recordId=user123" \
  -F "category=document" \
  -F "description=Important document"

# List attachments for a record
curl -X GET "http://localhost:3000/api/attachments/user123/document" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Download a file
curl -X GET http://localhost:3000/api/attachments/file/attachment_id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output downloaded_file.pdf
```

### Page Access Permissions
```bash
# Initialize default pages (Admin only)
curl -X POST http://localhost:3000/api/admin/page-permissions/initialize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all page permissions
curl -X GET http://localhost:3000/api/admin/page-permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Toggle role access to a page
curl -X PATCH http://localhost:3000/api/admin/page-permissions/Dashboard/toggle \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "Field Trainer"}'

# Get user's page permissions
curl -X GET http://localhost:3000/api/users/permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

### Authentication & Authorization
- **Password Security**: bcrypt hashing with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication with expiration
- **Role-Based Access**: 6-level hierarchical permissions
- **Session Management**: Stateless JWT tokens with proper expiration

### Network Security
- **Rate Limiting**: 100 requests per 15 minutes per IP (1000 in development)
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Helmet.js for HTTP security headers
- **Input Validation**: Comprehensive Joi validation schemas

### File Upload Security
- **File Type Validation**: Restricted file types based on MIME type
- **File Size Limits**: 10MB per file, 5 files maximum per upload
- **Directory Traversal Protection**: Secure file path generation
- **Virus/Malware Protection**: File type validation and sanitization
- **Authenticated Access**: All file operations require valid JWT token

### Data Protection
- **SQL Injection Protection**: MongoDB/Mongoose parameterized queries
- **XSS Prevention**: Input sanitization and validation
- **Error Handling**: Secure error responses (no sensitive data leakage)
- **Environment Variables**: Sensitive data stored in environment variables
- **Password Policies**: Minimum password requirements

## 📊 Validation Rules

### User Registration
- **Consultant ID**: Required, unique, uppercase, trimmed
- **Entry Date**: Required, valid date
- **First/Last Name**: 2-50 characters, required
- **Email**: Valid format, unique, required
- **Password**: Minimum 6 characters, required
- **Phone Numbers**: Max 20 characters each
- **Address Fields**: Appropriate length limits
- **Role**: Must be valid role from hierarchy

### File Upload Validation
- **File Size**: Maximum 10MB per file
- **File Count**: Maximum 5 files per upload
- **File Types**: Restricted by MIME type and extension
- **Metadata**: recordId and category required
- **Description**: Maximum 500 characters
- **Tags**: Array of strings, maximum 50 characters each

### Field Constraints
- **Comments/Remarks**: Max 500 characters
- **Address**: Max 200 characters
- **Names**: Max 100 characters  
- **Membership Amount**: Non-negative number
- **Phone/Fax Numbers**: Valid format, max 20 characters

## 🔧 Development Tools

### Available Scripts
```bash
npm run dev          # Development with hot reload (nodemon)
npm run build        # TypeScript compilation
npm run start        # Production server
npm run test         # Run test suite (Jest)
npm run clean        # Clean build directory
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGODB_URI` | MongoDB connection | Yes | - |
| `JWT_SECRET` | JWT signing key | Yes | - |
| `JWT_EXPIRE` | Token expiration | No | 7d |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | No | 12 |
| `LOG_LEVEL` | Logging level | No | info |

## 📈 Performance & Monitoring

- **Logging**: Structured logging with Winston (file + console)
- **Health Checks**: `/health` endpoint with uptime metrics
- **Error Tracking**: Comprehensive error logging with stack traces
- **Request Logging**: HTTP request logging with Morgan
- **Performance**: Optimized MongoDB queries with proper indexing

## 🧪 Testing

```bash
# Run all tests
npm test

# Build and run production version
npm run build && npm start
```

## 🚀 Deployment

### Production Checklist
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Configure production MongoDB URI
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up log rotation
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring

### Docker Deployment
```bash
# Build Docker image
docker build -t money1st-crm-backend .

# Run container
docker run -p 3000:3000 --env-file .env money1st-crm-backend
```

## 📄 API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md` with:
- Detailed endpoint specifications
- Request/response examples
- Error code references
- Authentication flows
- Role permission matrices

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Check the API documentation
- Review the troubleshooting guide



## 🚀 API Endpoints Overview

### **Authentication** (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin/IBA only)
- `GET /api/auth/profile` - Get current user profile

### **User Management** (`/api/users`) - Role-Based Access
- `GET /api/users` - List users (BMA+ access)
- `GET /api/users/:id` - Get user by ID (BMA+ access) 
- `PUT /api/users/:id` - Update user (IBA+ access)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/permissions` - Get user's page permissions

### **🆕 Admin Panel** (`/api/admin`) - Admin Only Access

#### **Dashboard & Analytics**
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users/activity` - User activity and trends

#### **User Management**
- `GET /api/admin/users` - Get all users with advanced filtering
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/bulk` - Bulk update multiple users
- `DELETE /api/admin/users/bulk` - Delete multiple users

#### **Individual User Operations**
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user active/inactive
- `PATCH /api/admin/users/:id/role` - Change user role/privileges
- `PATCH /api/admin/users/:id/reset-password` - Reset user password

#### **Page Access Permissions**
- `GET /api/admin/page-permissions` - Get all page permissions
- `POST /api/admin/page-permissions` - Create/update page permission
- `POST /api/admin/page-permissions/initialize` - Initialize default pages
- `PATCH /api/admin/page-permissions/:pageName/toggle` - Toggle role access
- `DELETE /api/admin/page-permissions/:pageName` - Delete page permission

### **🆕 File Attachments** (`/api/attachments`) - Authenticated Users

#### **File Operations**
- `POST /api/attachments/upload` - Upload file(s) with metadata
- `GET /api/attachments/:recordId/:category` - List attachments for record
- `GET /api/attachments/details/:id` - Get attachment details
- `GET /api/attachments/file/:id` - Download file
- `PUT /api/attachments/:id` - Update attachment metadata
- `DELETE /api/attachments/:id` - Delete attachment and file
- `GET /api/attachments/stats/:recordId` - Get attachment statistics

#### **File Categories**
- `note` - Note attachments
- `contact` - Contact-related files
- `deal` - Deal documents
- `client` - Client files
- `document` - General documents
- `image` - Image files
- `other` - Miscellaneous files

### **🆕 System**
- `GET /health` - Health check endpoint
- `GET /api-docs` - **Interactive Swagger documentation**
- `GET /api-docs.json` - OpenAPI JSON specification

> **💡 Pro Tip**: Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for interactive API testing!

## ✅ System Verification

To verify the backend is working correctly:

```bash
# 1. Build the project
npm run build

# 2. Start the server (requires MongoDB running)
npm run dev

# 3. Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2025-01-27T...",
#   "uptime": "X seconds"
# }
```

## 📋 Next Steps

The backend is fully implemented and ready for production use. To get started:

1. **Environment Setup**: Copy `.env.example` to `.env` and configure your values
2. **Database**: Ensure MongoDB is running and accessible
3. **Admin User**: Create first admin user via registration endpoint
4. **🆕 API Documentation**: Explore endpoints at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
5. **Frontend Integration**: Connect your React frontend to these API endpoints
6. **Deployment**: Follow the production checklist for deployment

---

**Last Updated**: June 2025  
**Status**: ✅ Production Ready  
**TypeScript**: Fully typed with zero compilation errors  
**🆕 Documentation**: Interactive Swagger/OpenAPI 3.0
