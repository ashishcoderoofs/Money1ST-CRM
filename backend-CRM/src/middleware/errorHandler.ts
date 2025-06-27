import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';

interface CustomError extends Error {
  status?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, { message: string }>;
}

export const errorHandler = (
  err: CustomError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  logger.error(err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map(e => e.message);
    res.status(400).json({ error: errors.join(', ') });
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({ error: `${field} already exists` });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token expired' });
    return;
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

