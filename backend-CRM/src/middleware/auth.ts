import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, UserRole } from '../types';

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
    
    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ error: 'JWT secret not configured' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid token or user inactive.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
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