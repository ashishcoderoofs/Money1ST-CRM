# Page Access Permissions System - Implementation Guide

## 🎉 System Successfully Implemented!

Your backend now has a complete page access permissions system that allows you to manage which roles can access different pages in your application.

## 📋 Available Endpoints

### Admin Endpoints (Admin role required)

1. **Initialize Default Pages**
   ```
   POST /api/admin/page-permissions/initialize
   ```
   - Creates default page permissions for: Dashboard, Securia, Reports, Organizational Chart, Branch Development, FNA Training, Admin

2. **Get All Page Permissions**
   ```
   GET /api/admin/page-permissions
   ```
   - Returns all page permissions with role access matrix

3. **Toggle Role Permission for a Page**
   ```
   PATCH /api/admin/page-permissions/{pageName}/toggle
   Body: {"role": "Field Trainer"}
   ```
   - Toggles access for a specific role to a specific page

4. **Create/Update Page Permission**
   ```
   POST /api/admin/page-permissions
   Body: {
     "pageName": "New Page",
     "description": "Description",
     "rolePermissions": {
       "Admin": true,
       "Field Builder": false,
       // ... other roles
     }
   }
   ```

5. **Delete Page Permission**
   ```
   DELETE /api/admin/page-permissions/{pageName}
   ```

### User Endpoints

6. **Get Current User's Page Permissions**
   ```
   GET /api/users/page-permissions
   ```
   - Returns the current user's page access permissions

## 🔧 Frontend Integration

### For Your Toggle Interface

To make your toggles work, update your frontend to call:

```javascript
// Toggle a role's access to a page
const togglePageAccess = async (pageName, role) => {
  try {
    const response = await fetch(`/api/admin/page-permissions/${pageName}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(result.message);
      // Update your UI to reflect the change
      return result.data.hasAccess;
    }
  } catch (error) {
    console.error('Error toggling permission:', error);
  }
};

// Example usage:
togglePageAccess('Dashboard', 'Field Trainer');
togglePageAccess('Securia', 'BMA');
```

### Load Initial Permissions

```javascript
// Load all page permissions for the admin interface
const loadPagePermissions = async () => {
  try {
    const response = await fetch('/api/admin/page-permissions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data; // Array of page permissions
    }
  } catch (error) {
    console.error('Error loading permissions:', error);
  }
};
```

### Check User's Page Access

```javascript
// Check if current user can access a page
const checkPageAccess = async () => {
  try {
    const response = await fetch('/api/users/page-permissions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      const permissions = result.data.permissions;
      // permissions.Dashboard, permissions.Securia, etc.
      return permissions;
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
  }
};
```

## 📊 Current Default Permissions Matrix

| Page | Admin | Field Builder | Field Trainer | Sr. BMA | BMA | IBA |
|------|-------|---------------|---------------|---------|-----|-----|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Securia | ✅ | ✅ | ✅* | ❌ | ❌ | ❌ |
| Reports | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Organizational Chart | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Branch Development | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| FNA Training | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Admin | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

*Field Trainer access to Securia was just granted during testing

## 🔗 API Testing

You can test all endpoints using the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## 🛠️ Next Steps

1. **Update Your React Components**: Modify your toggle switches to call the `/toggle` endpoint
2. **Add Loading States**: Show loading indicators while toggling permissions
3. **Add Error Handling**: Display error messages for failed operations
4. **Real-time Updates**: Consider using WebSocket or polling to update the UI when permissions change
5. **Audit Logging**: The system already logs all permission changes for audit purposes

## 🎯 Key Features

- ✅ **Granular Control**: Manage access per page per role
- ✅ **Default Setup**: Automatic initialization of common pages
- ✅ **Audit Trail**: All changes are logged with user information
- ✅ **API Documentation**: Full Swagger/OpenAPI documentation
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Database Storage**: Persistent storage in MongoDB
- ✅ **Role Validation**: Validates role names and prevents invalid assignments

Your page permissions system is now fully functional! 🎉
