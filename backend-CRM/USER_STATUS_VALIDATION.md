# User Status Validation System

## Overview

The Money1ST CRM implements a comprehensive user status validation system to ensure that only active users can access the system. This system operates on two levels:

1. **System-level validation** (`isActive` boolean field)
2. **User-level validation** (`status` enum field: 'Active' | 'Inactive')

## Implementation Details

### Status Fields

#### `isActive` (System-level)
- **Type**: Boolean
- **Default**: `true`
- **Purpose**: System administrator control over user access
- **Usage**: Can be set by system administrators to immediately disable user access

#### `status` (User-level)
- **Type**: Enum ('Active' | 'Inactive')
- **Default**: 'Active'
- **Purpose**: Business-level user status management
- **Usage**: Managed through normal business processes

### Validation Points

#### 1. Authentication Middleware (`auth.ts`)
```typescript
// Standard authentication with comprehensive status check
export const authenticate = async (req, res, next) => {
  // ... token validation ...
  
  const statusCheck = validateUserStatus(user);
  if (!statusCheck.isValid) {
    return res.status(401).json({ error: statusCheck.reason });
  }
  
  // ... continue ...
}
```

#### 2. Login Controller (`authController.ts`)
```typescript
export const login = async (req, res) => {
  // ... find user ...
  
  const statusCheck = validateUserStatus(user);
  if (!statusCheck.isValid) {
    return res.status(401).json({ error: statusCheck.reason });
  }
  
  // ... continue with login ...
}
```

#### 3. Enhanced Authentication Middleware (`enhancedAuth.ts`)
```typescript
// Real-time status validation for sensitive operations
export const authenticateWithRealtimeStatusCheck = async (req, res, next) => {
  // Performs fresh database lookup to verify current status
  const freshUser = await User.findById(req.user._id);
  const statusCheck = validateUserStatus(freshUser);
  // ... validation and logging ...
}
```

## Middleware Types

### 1. Standard Authentication
- **File**: `middleware/auth.ts`
- **Function**: `authenticate`
- **Usage**: All protected routes
- **Validation**: Token + cached user status

### 2. Enhanced Authentication
- **File**: `middleware/enhancedAuth.ts`
- **Function**: `authenticateWithRealtimeStatusCheck`
- **Usage**: Critical operations (create, update, delete)
- **Validation**: Token + real-time database status check

### 3. Admin Validation
- **File**: `middleware/enhancedAuth.ts`
- **Function**: `validateAdminStatus`
- **Usage**: Admin-only operations
- **Validation**: Token + role + real-time status

### 4. Access Logging
- **File**: `middleware/enhancedAuth.ts`
- **Function**: `logUserStatusAccess`
- **Usage**: All routes for monitoring
- **Purpose**: Log user access patterns and status

## Route Protection Examples

### Basic Protection
```typescript
// All consultant routes
router.use(authenticate);
router.get('/', getConsultants); // Basic auth only
```

### Enhanced Protection
```typescript
// Critical operations
router.post('/', authenticate, authorize('Admin'), authenticateWithRealtimeStatusCheck, createConsultant);
router.put('/:id', authenticate, authorize('Admin'), authenticateWithRealtimeStatusCheck, updateConsultant);
```

### Admin Protection
```typescript
// Admin-only operations
router.delete('/users/:id', validateAdminStatus, deleteUser);
```

## Status Validation Logic

### User Status Validator (`utils/userStatusValidator.ts`)

```typescript
export const validateUserStatus = (user: IUser): UserStatusCheck => {
  if (!user) {
    return { isValid: false, reason: 'User not found' };
  }

  // Check system-level active flag
  if (!user.isActive) {
    return { isValid: false, reason: 'Account is deactivated by system administrator' };
  }

  // Check user status
  if (user.status !== 'Active') {
    return { isValid: false, reason: 'User account status is inactive' };
  }

  return { isValid: true };
};
```

## Error Messages

### Login Errors
- `"Account is deactivated by system administrator"` - `isActive` = false
- `"User account status is inactive"` - `status` = 'Inactive'
- `"Invalid credentials"` - User not found or wrong password

### API Access Errors
- `"Access denied. Account is deactivated by system administrator"` - Real-time check failed (`isActive`)
- `"Access denied. User account status is inactive"` - Real-time check failed (`status`)
- `"Authentication required"` - No token provided
- `"Invalid token"` - Token validation failed

## Security Features

### 1. Real-time Validation
- Critical operations perform fresh database lookups
- Prevents use of cached/stale user data
- Immediate effect when user status changes

### 2. Comprehensive Logging
- All user access is logged with status information
- Failed access attempts are logged with detailed reasons
- Admin actions are logged for audit trail

### 3. Dual-level Control
- System administrators can instantly disable users (`isActive`)
- Business processes can manage user lifecycle (`status`)
- Both checks must pass for access

### 4. Short-lived Tokens
- JWT tokens expire after 10 minutes for enhanced security
- Reduces exposure window for compromised tokens
- Forces regular re-authentication

## Usage Guidelines

### For Developers

1. **Use standard `authenticate` for read operations**
   ```typescript
   router.get('/data', authenticate, getData);
   ```

2. **Use enhanced auth for write operations**
   ```typescript
   router.post('/data', authenticate, authorize('Admin'), authenticateWithRealtimeStatusCheck, createData);
   ```

3. **Use admin validation for admin operations**
   ```typescript
   router.delete('/users/:id', validateAdminStatus, deleteUser);
   ```

### For System Administrators

1. **Immediate user disable**: Set `isActive` to `false`
2. **Business process disable**: Set `status` to `'Inactive'`
3. **Monitor logs**: Check for failed access attempts
4. **Audit access**: Review user access patterns

## Testing

Run the comprehensive test suite:
```bash
node scripts/test-user-status-validation.js
```

This test validates:
- Active user login and API access
- Inactive user login blocking
- Real-time status validation
- System-level deactivation
- Token invalidation for inactive users

## Monitoring

The system logs all user access attempts including:
- User ID and email
- Endpoint accessed
- User status at time of access
- Success/failure with detailed reasons
- IP address and user agent

Log files are located in:
- `logs/combined.log` - All access logs
- `logs/error.log` - Failed access attempts
