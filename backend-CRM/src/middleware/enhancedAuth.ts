import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types/types';
import { validateUserStatus, getUserStatusInfo } from '../utils/userStatusValidator';
import logger from '../../utils/logger';

/**
 * Enhanced authentication middleware with real-time status validation
 * This middleware performs a fresh database lookup to verify user status
 * Use this for sensitive operations where real-time status is critical
 */
export const authenticateWithRealtimeStatusCheck = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // First perform standard authentication
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Perform fresh database lookup for real-time status
    const freshUser = await User.findById(req.user._id).select('-password');
    
    if (!freshUser) {
      logger.warn(`User ${req.user._id} not found during real-time status check`);
      res.status(401).json({ error: 'User account not found' });
      return;
    }

    // Validate current status
    const statusCheck = validateUserStatus(freshUser);
    if (!statusCheck.isValid) {
      const statusInfo = getUserStatusInfo(freshUser);
      logger.warn(`Real-time status check failed for user ${freshUser.email}:`, {
        userId: freshUser._id,
        email: freshUser.email,
        reason: statusCheck.reason,
        statusInfo,
        endpoint: req.originalUrl,
        method: req.method
      });
      
      res.status(401).json({ 
        error: `Access denied. ${statusCheck.reason}`,
        statusInfo: {
          systemActive: statusInfo.systemActive,
          userStatus: statusInfo.userStatus
        }
      });
      return;
    }

    // Update req.user with fresh data
    req.user = freshUser;
    next();
  } catch (error) {
    logger.error('Real-time status check error:', error);
    res.status(500).json({ error: 'Status validation failed' });
  }
};

/**
 * Middleware to log user status for monitoring purposes
 * Can be used to track user activity and status changes
 */
export const logUserStatusAccess = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  if (req.user) {
    const statusInfo = getUserStatusInfo(req.user);
    logger.info('User access logged:', {
      userId: req.user._id,
      email: req.user.email,
      endpoint: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      statusInfo
    });
  }
  next();
};

/**
 * Middleware specifically for admin operations
 * Ensures admin users are active before allowing admin actions
 */
export const validateAdminStatus = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    // Fresh lookup for admin user
    const freshAdmin = await User.findById(req.user._id).select('-password');
    
    if (!freshAdmin) {
      res.status(401).json({ error: 'Admin account not found' });
      return;
    }

    const statusCheck = validateUserStatus(freshAdmin);
    if (!statusCheck.isValid) {
      logger.error(`Admin access denied for ${freshAdmin.email}: ${statusCheck.reason}`);
      res.status(401).json({ error: `Admin access denied. ${statusCheck.reason}` });
      return;
    }

    req.user = freshAdmin;
    next();
  } catch (error) {
    logger.error('Admin status validation error:', error);
    res.status(500).json({ error: 'Admin status validation failed' });
  }
};
