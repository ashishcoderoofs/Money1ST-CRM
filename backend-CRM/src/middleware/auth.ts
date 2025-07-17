import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, UserRole } from '../types/types';
import { validateUserStatus } from '../utils/userStatusValidator';
import logger from '../../utils/logger';

interface JwtPayload {
  id: string;
}

export const authenticate = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    logger.info('Auth header:', req.header('Authorization'));
    logger.info('Extracted token:', token);

    if (!token) {
      logger.warn('No token provided');
      res.status(401).json({ error: 'Access denied. No token provided.', redirectTo: '/login' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT secret not configured');
      res.status(500).json({ error: 'JWT secret not configured' });
      return;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      logger.info('Decoded JWT:', decoded);
    } catch (err) {
      logger.warn('JWT verification failed:', err);
      res.status(401).json({ error: 'Invalid token.', redirectTo: '/login' });
      return;
    }

    const user = await User.findById(decoded.id).select('-password');
    logger.info('User found:', user);

    if (!user) {
      logger.warn('User not found for id:', decoded.id);
      res.status(401).json({ error: 'Invalid token. User not found.', redirectTo: '/login' });
      return;
    }

    // Comprehensive user status validation
    const statusCheck = validateUserStatus(user);
    if (!statusCheck.isValid) {
      logger.warn(`Access denied for user ${user.email}: ${statusCheck.reason}`);
      res.status(401).json({ error: `Access denied. ${statusCheck.reason}`, redirectTo: '/login' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Unexpected error in authenticate:', error);
    res.status(401).json({ error: 'Invalid token.', redirectTo: '/login' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.', redirectTo: '/login' });
      return;
    }

    const hasPermission = roles.some(role => req.user!.hasPermission(role));
    
    if (!hasPermission) {
      res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        requiredRoles: roles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'Admin') {
    res.status(403).json({ error: 'Admin access required.' });
    return;
  }
  next();
};