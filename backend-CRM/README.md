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

## �👥 Dynamic Role-Based Access Control (RBAC)

### **🆕 Data-Driven Permissions System**
The system uses a **dynamic, database-stored permissions approach** where all API endpoints check permissions against stored data rather than hardcoded role checks. This allows for flexible, runtime-configurable access control.

### **Role Hierarchy (Most to Least Privileges)**
1. **Admin** (Level 6) - System administrators with full access
2. **Field Builder** (Level 5) - Senior consultants with management capabilities
3. **Field Trainer** (Level 4) - Training specialists and supervisors
4. **Sr. BMA** (Level 3) - Senior Business Management Associates
5. **BMA** (Level 2) - Business Management Associates
6. **IBA** (Level 1) - Independent Business Associates (entry level)

### **Dynamic Permissions Matrix**
*Permissions are stored in the database and can be modified at runtime via API endpoints*

| Feature | Description | Default Access Pattern |
|---------|-------------|-------------------------|
| Dashboard | View main dashboard | **All Roles** |
| Contacts | View and manage contacts | **All Roles** |
| Deals | View and manage deals | **All Roles** |
| Tasks | View and manage tasks | **All Roles** |
| Reports | View analytics and reports | **Sr. BMA+** (Admin, Field Builder, Field Trainer, Sr. BMA) |
| User Management | Create and manage users | **Field Builder+** (Admin, Field Builder) |
| Securia Access | Access to Securia module | **Admin Only** |

### **API Operation Permissions**
*Each API endpoint checks against stored permissions data*

| API Endpoint | Permission Key | Default Access |
|--------------|----------------|----------------|
| `GET /api/users` | `users.view` | **BMA+** |
| `POST /api/users` | `users.create` | **Admin Only** |
| `PUT /api/users/:id` | `users.edit` | **IBA+** (own profile) / **BMA+** (others) |
| `DELETE /api/users/:id` | `users.delete` | **Admin Only** |
| `GET /api/admin/dashboard/stats` | `admin.dashboard` | **Admin Only** |
| `POST /api/attachments/upload` | `attachments.upload` | **All Authenticated** |
| `GET /api/admin/page-permissions` | `admin.permissions` | **Admin Only** |

### **How Dynamic Permissions Work**

1. **Database Storage**: Permissions are stored in `PagePermission` collection
2. **Runtime Checks**: All API endpoints use middleware that queries the database
3. **Flexible Configuration**: Admins can modify permissions without code changes
4. **Hierarchical Support**: Higher roles inherit lower-level permissions
5. **Caching**: Permissions are cached for performance with TTL expiration

```typescript
// Example: Dynamic permission check in middleware
const checkPermission = (permissionKey: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const hasPermission = await PermissionService.checkAccess(userRole, permissionKey);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions',
        required: permissionKey 
      });
    }
    
    next();
  };
};

// Usage in routes
router.get('/dashboard/stats', 
  authenticate, 
  checkPermission('admin.dashboard'), 
  getDashboardStats
);
```

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

### Dynamic Permission Management
```bash
# Initialize default permissions (creates database records)
curl -X POST http://localhost:3000/api/admin/page-permissions/initialize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all current permissions configuration
curl -X GET http://localhost:3000/api/admin/page-permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update a specific role's access to a feature
curl -X PATCH http://localhost:3000/api/admin/page-permissions/Reports/toggle \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "BMA"}'

# Create new permission rule
curl -X POST http://localhost:3000/api/admin/page-permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pageName": "Advanced Analytics",
    "description": "Access to advanced analytics dashboard",
    "rolePermissions": {
      "Admin": true,
      "Field Builder": true,
      "Field Trainer": false,
      "Sr. BMA": false,
      "BMA": false,
      "IBA": false
    }
  }'

# Check user's current permissions
curl -X GET http://localhost:3000/api/users/permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Administrative Operations
```bash
# Dashboard Stats (Admin only - checked against database permissions)
curl -X GET http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Bulk Update Users (Admin only - dynamic permission check)
curl -X PUT http://localhost:3000/api/admin/users/bulk \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user1_id", "user2_id"],
    "updates": {
      "role": "Sr. BMA",
      "status": "Active"
    }
  }'

# Create new user (permission-based access control)
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "consultantId": "CON009",
    "entryDate": "2025-06-28",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@money1st.com",
    "password": "securepass456",
    "role": "Field Trainer"
  }'
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
*All endpoints use dynamic, database-stored permission checks*

### **Authentication** (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (permission-based access)
- `GET /api/auth/profile` - Get current user profile

### **User Management** (`/api/users`) - Dynamic Permission Control
- `GET /api/users` - List users (permission: `users.view`)
- `GET /api/users/:id` - Get user by ID (permission: `users.view`)
- `PUT /api/users/:id` - Update user (permission: `users.edit`)
- `DELETE /api/users/:id` - Delete user (permission: `users.delete`)
- `GET /api/users/permissions` - Get user's page permissions

### **🆕 Admin Panel** (`/api/admin`) - Permission-Based Access Control

#### **Dashboard & Analytics**
- `GET /api/admin/dashboard/stats` - Dashboard statistics (permission: `admin.dashboard`)
- `GET /api/admin/users/activity` - User activity (permission: `admin.analytics`)

#### **User Management**
- `GET /api/admin/users` - Get all users (permission: `admin.users.view`)
- `POST /api/admin/users` - Create new user (permission: `admin.users.create`)
- `PUT /api/admin/users/bulk` - Bulk update (permission: `admin.users.bulk`)
- `DELETE /api/admin/users/bulk` - Bulk delete (permission: `admin.users.delete`)

#### **Individual User Operations**
- `PATCH /api/admin/users/:id/toggle-status` - Toggle status (permission: `admin.users.edit`)
- `PATCH /api/admin/users/:id/role` - Change role (permission: `admin.users.role`)
- `PATCH /api/admin/users/:id/reset-password` - Reset password (permission: `admin.users.edit`)

#### **🆕 Dynamic Page Permissions Management**
- `GET /api/admin/page-permissions` - Get all permissions (permission: `admin.permissions`)
- `POST /api/admin/page-permissions` - Create/update permission (permission: `admin.permissions`)
- `POST /api/admin/page-permissions/initialize` - Initialize defaults (permission: `admin.permissions`)
- `PATCH /api/admin/page-permissions/:pageName/toggle` - Toggle access (permission: `admin.permissions`)
- `DELETE /api/admin/page-permissions/:pageName` - Delete permission (permission: `admin.permissions`)

### **🆕 File Attachments** (`/api/attachments`) - Permission-Based Access

#### **File Operations**
- `POST /api/attachments/upload` - Upload files (permission: `attachments.upload`)
- `GET /api/attachments/:recordId/:category` - List attachments (permission: `attachments.view`)
- `GET /api/attachments/details/:id` - Get details (permission: `attachments.view`)
- `GET /api/attachments/file/:id` - Download file (permission: `attachments.download`)
- `PUT /api/attachments/:id` - Update metadata (permission: `attachments.edit`)
- `DELETE /api/attachments/:id` - Delete attachment (permission: `attachments.delete`)
- `GET /api/attachments/stats/:recordId` - Get statistics (permission: `attachments.view`)

#### **File Categories** (Permission-controlled access)
- `note` - Note attachments
- `contact` - Contact-related files  
- `deal` - Deal documents
- `client` - Client files
- `document` - General documents
- `image` - Image files
- `other` - Miscellaneous files

### **🆕 System & Monitoring**
- `GET /health` - Health check endpoint (no authentication required)
- `GET /api-docs` - **Interactive Swagger documentation** (no authentication required)
- `GET /api-docs.json` - OpenAPI JSON specification (no authentication required)

> **💡 Dynamic Permissions**: All protected endpoints check permissions against the database in real-time. Admins can modify access without code changes!

### **🔄 Permission System Architecture**

```typescript
// Example permission check flow:
// 1. User makes API request
// 2. Authentication middleware validates JWT
// 3. Permission middleware queries database for role permissions
// 4. Access granted/denied based on stored data
// 5. Optional: Permission cache updated for performance

interface PermissionCheck {
  endpoint: string;
  method: string;
  permission: string;
  userRole: string;
  access: boolean;
  timestamp: Date;
}
```

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

# 4. Test file upload (requires authentication)
curl -X POST http://localhost:3000/api/attachments/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@test.txt" \
  -F "recordId=test123" \
  -F "category=document"

# 5. Access interactive documentation
# Visit: http://localhost:3000/api-docs
```

## 📋 Next Steps

The backend is fully implemented with **dynamic, data-driven permissions** and ready for production use. To get started:

1. **Environment Setup**: Copy `.env.example` to `.env` and configure your values
2. **Database**: Ensure MongoDB is running and accessible
3. **🆕 Bootstrap System**: Run `npm run bootstrap` to create admin user and default permissions
4. **🆕 Initialize Permissions**: Call `/api/admin/page-permissions/initialize` to set up default permission rules
5. **🆕 File Storage**: Ensure proper permissions for `uploads/` directory  
6. **🆕 API Documentation**: Explore endpoints at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
7. **Frontend Integration**: Connect your React frontend to these permission-aware API endpoints
8. **🆕 Permission Configuration**: Use admin endpoints to customize role permissions as needed
9. **Deployment**: Follow the production checklist for deployment

### **🔧 Permission System Setup**

```bash
# 1. Start the server
npm run dev

# 2. Create admin user (if not exists)
npm run bootstrap

# 3. Login as admin to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@money1st.com", "password": "admin123"}'

# 4. Initialize default permissions in database
curl -X POST http://localhost:3000/api/admin/page-permissions/initialize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Customize permissions as needed
curl -X PATCH http://localhost:3000/api/admin/page-permissions/Reports/toggle \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "BMA"}'

# 6. Verify permissions are working
curl -X GET http://localhost:3000/api/users/permissions \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

### **🎯 Key Benefits of Dynamic Permissions**

- **Runtime Configuration**: Change permissions without code deployment
- **Granular Control**: Fine-tune access at feature and operation level  
- **Audit Trail**: Track permission changes and access attempts
- **Scalable**: Easy to add new features and permission rules
- **Frontend Integration**: Frontend can query user permissions for UI control
- **Performance**: Cached permissions for fast access checks

## 📚 Additional Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**: Complete API reference with examples
- **[ATTACHMENT_SYSTEM.md](./ATTACHMENT_SYSTEM.md)**: File attachment system implementation guide
- **[PAGE_PERMISSIONS_GUIDE.md](./PAGE_PERMISSIONS_GUIDE.md)**: Page access permissions system guide
- **[Swagger UI](http://localhost:3000/api-docs)**: Interactive API documentation (when server is running)

---

**Last Updated**: January 2025  
**Status**: ✅ Production Ready  
**Features**: Complete CRM Backend + File Attachments + Page Permissions  
**TypeScript**: Fully typed with zero compilation errors  
**🆕 Documentation**: Interactive Swagger/OpenAPI 3.0 + Comprehensive Guides
+++++done++++