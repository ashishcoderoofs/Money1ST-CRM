# Money1st CRM Nexus - API Documentation

## 📚 Interactive Documentation
**🔗 Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

> **💡 Recommended**: Use the interactive Swagger documentation for testing and exploring all endpoints with real-time examples!

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

**Access:** Admin

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "Field Builder"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "New User",
    "email": "newuser@example.com",
    "role": "Field Builder",
    "isActive": true,
    "createdBy": {
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin"
    }
  },
  "message": "User created successfully"
}
```

### PUT /api/admin/users/bulk
Bulk update multiple users.

**Access:** Admin

**Request Body:**
```json
{
  "userIds": [
    "60f7b3b3b3b3b3b3b3b3b3b1",
    "60f7b3b3b3b3b3b3b3b3b3b2",
    "60f7b3b3b3b3b3b3b3b3b3b3"
  ],
  "updates": {
    "role": "Senior BM",
    "isActive": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 users updated successfully",
  "modifiedCount": 3
}
```

**Restrictions:**
- Cannot bulk update your own account
- Role assignment follows hierarchy rules
- Minimum 1 user ID required

### PATCH /api/admin/users/:id/toggle-status
Toggle user active/inactive status.

**Access:** Admin

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "email": "user@example.com",
    "isActive": true
  }
}
```

**Restrictions:**
- Cannot toggle your own account status

---

## Error Responses

### Common Error Format
```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Example Error Responses

**Validation Error (400):**
```json
{
  "error": "\"email\" must be a valid email"
}
```

**Authentication Error (401):**
```json
{
  "error": "Access denied. No token provided"
}
```

**Authorization Error (403):**
```json
{
  "error": "Access denied. Insufficient permissions"
}
```

**Not Found Error (404):**
```json
{
  "error": "User not found"
}
```

---

## Rate Limiting
- **Window:** 15 minutes
- **Limit:** 100 requests per IP
- **Response when exceeded:** 429 Too Many Requests

---

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- Input validation
- CORS protection
- Security headers (Helmet.js)

---

## 🆕 Recent Updates (June 2025)

### **New Features Added:**
- **🔗 Interactive Swagger Documentation**: Complete OpenAPI 3.0 specification
- **📊 Advanced Admin Panel**: Comprehensive user management capabilities
- **⚡ Bulk Operations**: Update/delete multiple users simultaneously
- **📈 User Analytics**: Activity tracking and registration trends
- **🔐 Enhanced Security**: Updated role hierarchy and permission system
- **🎯 Role Management**: Direct role assignment and password reset capabilities

### **Updated Role Hierarchy:**
- **Previous**: Field Builder < Field Trainer < Sr. BMA < BMA < IBA < Admin
- **🆕 Current**: Admin > Field Builder > Field Trainer > Sr. BMA > BMA > IBA

### **New Admin Endpoints:**
- `GET /api/admin/users/activity` - User analytics
- `PUT /api/admin/users/bulk` - Bulk user updates
- `DELETE /api/admin/users/bulk` - Bulk user deletion
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user status
- `PATCH /api/admin/users/:id/role` - Update user role
- `PATCH /api/admin/users/:id/reset-password` - Reset passwords

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
