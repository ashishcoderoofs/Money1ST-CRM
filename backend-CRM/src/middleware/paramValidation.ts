import { Request, Response, NextFunction } from 'express';

// Middleware to validate MongoDB ObjectId parameters
export const validateObjectId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id || id === 'undefined' || id === 'null') {
      res.status(400).json({ 
        error: `Valid ${paramName} is required`,
        received: id 
      });
      return;
    }

    // Check if it's a valid MongoDB ObjectId (24 character hex string)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ 
        error: `Invalid ${paramName} format. Must be a valid MongoDB ObjectId`,
        received: id 
      });
      return;
    }

    next();
  };
};

// Middleware to validate required body fields
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];
    
    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
      return;
    }
    
    next();
  };
};

// Middleware to sanitize and validate common query parameters
export const validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
  const { page, limit } = req.query;
  
  // Validate page parameter
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    res.status(400).json({ 
      error: 'Page must be a positive number',
      received: page 
    });
    return;
  }
  
  // Validate limit parameter
  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 1000)) {
    res.status(400).json({ 
      error: 'Limit must be a number between 1 and 1000',
      received: limit 
    });
    return;
  }
  
  next();
};
