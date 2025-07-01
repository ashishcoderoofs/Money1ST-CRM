import { IUser } from '../types';

/**
 * Utility functions for user status validation
 */

export interface UserStatusCheck {
  isValid: boolean;
  reason?: string;
}

/**
 * Comprehensive user status check
 * Validates both system-level (isActive) and user-level (status) flags
 */
export const validateUserStatus = (user: IUser): UserStatusCheck => {
  if (!user) {
    return {
      isValid: false,
      reason: 'User not found'
    };
  }

  // Check system-level active flag
  if (!user.isActive) {
    return {
      isValid: false,
      reason: 'Account is deactivated by system administrator'
    };
  }

  // Check user status
  if (user.status !== 'Active') {
    return {
      isValid: false,
      reason: 'User account status is inactive'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Middleware-friendly status check
 * Returns boolean for quick validation
 */
export const isUserActive = (user: IUser): boolean => {
  return validateUserStatus(user).isValid;
};

/**
 * Get user status details for logging/debugging
 */
export const getUserStatusInfo = (user: IUser) => {
  if (!user) {
    return {
      status: 'Not Found',
      isActive: false,
      systemActive: false,
      userStatus: 'N/A'
    };
  }

  return {
    status: isUserActive(user) ? 'Active' : 'Inactive',
    isActive: isUserActive(user),
    systemActive: user.isActive,
    userStatus: user.status
  };
};
