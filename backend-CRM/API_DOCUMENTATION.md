# Money1st CRM Nexus - API Documentation

## 📚 Interactive Documentation

**🔗 Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
**🔗 OpenAPI Spec**: [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

> **💡 Recommended**: Use the interactive Swagger documentation for testing and exploring all endpoints with real-time examples!

### Swagger Features
- **🧪 Interactive Testing**: Test all endpoints directly from the browser
- **📋 Complete Schemas**: View all request/response models
- **🔐 Authentication**: Built-in JWT token management
- **📖 Real-time Examples**: Live request/response examples
- **📥 Export Options**: Download OpenAPI specification
- **🎯 Endpoint Discovery**: Browse all available endpoints by category

### Categories in Swagger UI
- **Authentication** - Login, register, profile management
- **Users** - User management with role-based access
- **Admin** - Administrative operations (Admin only)
- **🆕 Attachments** - File upload and management system
- **🆕 Page Permissions** - Page access control management

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication using JWT Bearer tokens.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

## 🆕 Updated Role Hierarchy
The system uses role-based access control with the following hierarchy (from highest to lowest privileges):

1. **Admin** (Level 6) - Full system access
2. **Field Builder** (Level 5) - Senior management capabilities  
3. **Field Trainer** (Level 4) - Training and supervision
4. **Sr. BMA** (Level 3) - Senior Business Management Associates
5. **BMA** (Level 2) - Business Management Associates
6. **IBA** (Level 1) - Independent Business Associates (entry level)

---

## Health Check

### GET /health
Check server health status.

**Access:** Public

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-06-27T10:30:00.000Z",
  "uptime": 3600.123
}
```

---

## 📖 API Documentation Endpoints

### GET /api-docs
Interactive Swagger UI documentation interface.

**Access:** Public  
**Returns:** HTML page with interactive API documentation

### GET /api-docs.json
OpenAPI 3.0 specification in JSON format.

**Access:** Public  
**Returns:** Complete API specification for import into tools like Postman

---

## Authentication Endpoints

### POST /api/auth/login
Login with email and password.

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Field Builder",
    "lastLogin": "2025-06-27T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `401` - Account is deactivated

### POST /api/auth/register
Register a new user (Admin/IBA only).

**Access:** 

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "Field Builder"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "Field Builder"
  }
}
```

**Validation Rules:**
- `name`: 2-50 characters, required
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required
- `role`: One of the valid roles, optional (defaults to Field Builder)

### GET /api/auth/profile
Get current user profile.

**Access:** Authenticated users

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Field Builder",
    "isActive": true,
    "lastLogin": "2025-06-27T10:30:00.000Z",
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": {
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin"
    }
  }
}
```

---

## User Management Endpoints

### GET /api/users
Get list of users with pagination and filtering.

**Access:** BM, IBA, Admin

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status (true/false)
- `search` (optional): Search by name or email

**Example Request:**
```
GET /api/users?page=1&limit=10&role=Field Builder&isActive=true&search=john
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Field Builder",
      "isActive": true,
      "lastLogin": "2025-06-27T10:30:00.000Z",
      "createdAt": "2025-06-01T00:00:00.000Z",
      "createdBy": {
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "Admin"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/users/:id
Get user by ID.

**Access:** BM, IBA, Admin

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Field Builder",
    "isActive": true,
    "lastLogin": "2025-06-27T10:30:00.000Z",
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": {
      "name": "Admin User",
      "email": "admin@example.com", 
      "role": "Admin"
    }
  }
}
```

### PUT /api/users/:id
Update user information.

**Access:** IBA, Admin

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "Senior BM",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "Senior BM",
    "isActive": true
  }
}
```

**Validation Rules:**
- `name`: 2-50 characters, optional
- `email`: Valid email format, optional
- `role`: Valid role, optional
- `isActive`: Boolean, optional

**Role Assignment Rules:**
- Users cannot assign roles equal to or higher than their own
- Role hierarchy must be respected

### DELETE /api/users/:id
Delete user (Admin only).

**Access:** Admin

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Restrictions:**
- Users cannot delete themselves
- Only Admin can delete users

---

## 🆕 Admin Panel Endpoints

> **Note**: All admin endpoints require **Admin** role access and proper JWT authentication.

### GET /api/admin/dashboard/stats
Get comprehensive dashboard statistics.

**Access:** Admin only

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "activeUsers": 142,
    "inactiveUsers": 8,
    "recentUsers": 12,
    "roleDistribution": [
      {
        "_id": "Admin",
        "count": 5
      },
      {
        "_id": "Field Builder",
        "count": 80
      },
      {
        "_id": "Field Trainer", 
        "count": 35
      },
      {
        "_id": "Sr. BMA",
        "count": 20
      },
      {
        "_id": "BMA",
        "count": 15
      },
      {
        "_id": "IBA",
        "count": 10
      }
    ]
  }
}
```

### 🆕 GET /api/admin/users/activity
Get user activity and registration trends.

**Access:** Admin only

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "recentLogins": [
      {
        "firstName": "John",
        "lastName": "Doe", 
        "email": "john@example.com",
        "lastLogin": "2025-06-27T10:30:00.000Z",
        "role": "Field Builder"
      }
    ],
    "registrationStats": [
      {
        "_id": {
          "year": 2025,
          "month": 6,
          "day": 27
        },
        "count": 5
      }
    ],
    "period": "30 days"
  }
}
```

### GET /api/admin/users
Get all users with advanced admin filtering.

**Access:** Admin only

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status (true/false)
- `search` (optional): Search in name, email, or consultant ID

**Response:**
```json
{
  "success": true,
  "users": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### POST /api/admin/users
Create new user (Admin only).

**Access:** Admin only

**Request Body:** Same as registration but admin can assign any role

**Response:**
```json
{
  "success": true,
  "user": {...},
  "message": "User created successfully"
}
```

### 🆕 PUT /api/admin/users/bulk
Bulk update multiple users.

**Access:** Admin only

**Request Body:**
```json
{
  "userIds": ["60f1b2b5c8e4f123456789ab", "60f1b2b5c8e4f123456789ac"],
  "updates": {
    "role": "Field Trainer",
    "isActive": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 users updated successfully",
  "modifiedCount": 2
}
```

### 🆕 DELETE /api/admin/users/bulk
Delete multiple users.

**Access:** Admin only

**Request Body:**
```json
{
  "userIds": ["60f1b2b5c8e4f123456789ab", "60f1b2b5c8e4f123456789ac"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 users deleted successfully",
  "deletedCount": 2
}
```

### 🆕 PATCH /api/admin/users/:id/toggle-status
Toggle user active/inactive status.

**Access:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully",
  "user": {
    "id": "60f1b2b5c8e4f123456789ab",
    "email": "user@example.com",
    "isActive": true
  }
}
```

### 🆕 PATCH /api/admin/users/:id/role
Update user role/privileges.

**Access:** Admin only

**Request Body:**
```json
{
  "role": "Field Trainer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated to Field Trainer successfully",
  "user": {
    "id": "60f1b2b5c8e4f123456789ab",
    "email": "user@example.com",
    "role": "Field Trainer"
  }
}
```

### 🆕 PATCH /api/admin/users/:id/reset-password
Reset user password.

**Access:** Admin only

**Request Body:**
```json
{
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Validation:**
- Password must be at least 6 characters long
- Cannot reset own password through this endpoint

### GET /api/admin/permissions
Get system permissions and role hierarchy.

**Access:** Admin only

**Response:**
```json
{
  "success": true,
  "permissions": {
    "roles": [
      "Admin",
      "Field Builder",
      "Field Trainer",
      "Sr. BMA",
      "BMA",
      "IBA"
    ],
    "hierarchy": {
      "Admin": 6,
      "Field Builder": 5,
      "Field Trainer": 4,
      "Sr. BMA": 3,
      "BMA": 2,
      "IBA": 1
    }
  }
}
```

### **New Admin Endpoints:**
- `GET /api/admin/users/activity` - User analytics
- `PUT /api/admin/users/bulk` - Bulk user updates
- `DELETE /api/admin/users/bulk` - Bulk user deletion
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user status
- `PATCH /api/admin/users/:id/role` - Update user role
- `PATCH /api/admin/users/:id/reset-password` - Reset passwords
- `GET /api/admin/permissions` - Get system permissions and role hierarchy
- **🆕 Page Permissions Endpoints:**
  - `GET /api/admin/page-permissions` - Get all page permissions
  - `POST /api/admin/page-permissions` - Create/update page permission
  - `PATCH /api/admin/page-permissions/{pageName}/toggle` - Toggle role access to page
  - `POST /api/admin/page-permissions/initialize` - Initialize default pages
  - `DELETE /api/admin/page-permissions/{pageName}` - Delete page permission

### **New User Endpoints:**
- `GET /api/users/page-permissions` - Get current user's page access permissions

### **New File Attachment System:**
- `POST /api/attachments/upload` - Upload file attachments
- `GET /api/attachments/{recordId}/{category}` - List attachments
- `GET /api/attachments/file/{id}` - Download file
- `DELETE /api/attachments/{id}` - Delete attachment
- `PUT /api/attachments/{id}` - Update attachment metadata
- `GET /api/attachments/stats/{recordId}` - Get attachment statistics

### **Documentation Improvements:**
- Interactive Swagger UI at `/api-docs`
- Complete request/response examples
- Real-time API testing capabilities
- Professional OpenAPI 3.0 specification

---

## Environment Variables Required
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/money1st_crm
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
```

---

**Last Updated**: June 2025  
**Version**: 2.0  
**Interactive Docs**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📚 Interactive Swagger Documentation

**🔗 Primary Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
**🔗 OpenAPI Specification**: [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

> **⚡ Quick Start**: For immediate API testing and exploration, visit the Swagger UI above. This documentation provides comprehensive details, while Swagger offers interactive testing.

### 🎯 Why Use Swagger UI?

- **🧪 Live Testing**: Execute API calls directly from your browser
- **📋 Complete Schemas**: View all request/response models with examples
- **🔐 Built-in Auth**: Test protected endpoints with JWT token management
- **📖 Real-time Validation**: Immediate feedback on request formatting
- **📥 Export Options**: Download OpenAPI specification for tools like Postman
- **🎯 Organized by Tags**: Endpoints grouped by functionality

### 📂 API Categories

| Category | Description | Endpoints |
|----------|-------------|-----------|
| **Authentication** | User login, registration, profile | 3 endpoints |
| **Users** | User management with RBAC | 4 endpoints |
| **Admin** | Administrative operations | 12+ endpoints |
| **🆕 Attachments** | File upload and management | 7 endpoints |
| **🆕 Page Permissions** | Page access control | 6 endpoints |

### 🔧 Swagger Setup

1. **Start the server**: `npm start`
2. **Open Swagger UI**: Navigate to [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
3. **Authenticate**: Click "Authorize" and enter your JWT token
4. **Test endpoints**: Expand any endpoint and click "Try it out"

### 🧪 Testing with Swagger

#### Step 1: Get Authentication Token
1. Go to **Authentication > POST /api/auth/login**
2. Click "Try it out"
3. Enter credentials:
   ```json
   {
     "email": "admin@money1st.com",
     "password": "admin123"
   }
   ```
4. Click "Execute"
5. Copy the `token` from the response

#### Step 2: Authorize in Swagger
1. Click the "🔒 Authorize" button at the top of the page
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Click "Authorize"

#### Step 3: Test Protected Endpoints
Now you can test any protected endpoint directly in the browser!

**Popular Testing Scenarios:**
- **User Management**: Try `GET /api/admin/users` to list all users
- **Page Permissions**: Use `POST /api/admin/page-permissions/initialize` to set up default pages
- **File Upload**: Test `POST /api/attachments/upload` with file uploads
- **Toggle Permissions**: Use `PATCH /api/admin/page-permissions/{pageName}/toggle`

---

## 🆕 Page Access Permissions System

### Overview
The system now includes granular page-level access control, allowing administrators to manage which roles can access specific pages/modules in the application.

### Available Pages
- **Dashboard** - Main system overview
- **Securia** - Securia management module
- **Reports** - Analytics and reporting
- **Organizational Chart** - Company structure
- **Branch Development** - Branch management
- **FNA Training** - Financial Needs Analysis training
- **Admin** - Administrative functions

### API Endpoints

#### Get All Page Permissions
```http
GET /api/admin/page-permissions
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "pageName": "Dashboard",
      "rolePermissions": {
        "Admin": true,
        "Field Builder": true,
        "Field Trainer": true,
        "Sr. BMA": true,
        "BMA": true,
        "IBA": true
      },
      "description": "Main dashboard with system overview"
    }
  ]
}
```

#### Toggle Role Permission
```http
PATCH /api/admin/page-permissions/{pageName}/toggle
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "Field Trainer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Field Trainer access to Securia granted",
  "data": {
    "pageName": "Securia",
    "role": "Field Trainer",
    "hasAccess": true,
    "allPermissions": {
      "Admin": true,
      "Field Builder": true,
      "Field Trainer": true,
      "Sr. BMA": false,
      "BMA": false,
      "IBA": false
    }
  }
}
```

#### Initialize Default Pages
```http
POST /api/admin/page-permissions/initialize
Authorization: Bearer {token}
```

#### Get User's Page Permissions
```http
GET /api/users/page-permissions
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "Field Builder",
    "permissions": {
      "Dashboard": true,
      "Securia": true,
      "Reports": true,
      "Organizational Chart": true,
      "Branch Development": true,
      "FNA Training": true,
      "Admin": false
    }
  }
}
```

### Frontend Integration
```javascript
// Check if user can access a page
const checkPageAccess = async (pageName) => {
  const response = await fetch('/api/users/page-permissions');
  const { data } = await response.json();
  return data.permissions[pageName];
};

// Toggle role permission (Admin only)
const toggleRolePermission = async (pageName, role) => {
  const response = await fetch(`/api/admin/page-permissions/${pageName}/toggle`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role })
  });
  return response.json();
};
```

---

## 🆕 File Attachment System

### Overview
Complete file attachment system replacing Supabase storage with backend API solution.

### Key Features
- File upload with metadata tracking
- Organized storage by category and record
- Download and deletion capabilities
- File type validation and size limits
- Role-based access control

### API Endpoints

#### Upload File
```http
POST /api/attachments/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: (binary file)
- recordId: string
- category: string (note, contact, deal, client, document, image, other)
- description?: string
- tags?: string (JSON array)
```

#### List Attachments
```http
GET /api/attachments/{recordId}/{category}?page=1&limit=50
Authorization: Bearer {token}
```

#### Download File
```http
GET /api/attachments/file/{attachmentId}
Authorization: Bearer {token}
```

#### Delete Attachment
```http
DELETE /api/attachments/{attachmentId}
Authorization: Bearer {token}
```

### File Storage Structure
```
uploads/
├── client/
│   ├── client-123/
│   │   ├── 1640995200000-contract.pdf
│   │   └── 1640995300000-photo.jpg
├── deal/
│   └── deal-456/
│       └── 1640995400000-proposal.docx
└── note/
    └── note-789/
        └── 1640995500000-attachment.txt
```

### Security Features
- Authentication required for all operations
- Users can only delete/update their own uploads (unless admin)
- File type validation
- File size limits (10MB per file)
- Secure file paths preventing directory traversal

---
