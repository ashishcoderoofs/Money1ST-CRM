import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { RegisterRequest, LoginRequest, UpdateUserRequest } from '../types';

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object<RegisterRequest>({
    // Main Information
    consultantId: Joi.string().required().uppercase().trim(),
    entryDate: Joi.date().optional(),
    position: Joi.string().optional().trim(),
    title: Joi.string().optional().trim(),
    firstName: Joi.string().min(2).max(50).required().trim(),
    middleInitial: Joi.string().max(5).optional().trim(),
    lastName: Joi.string().min(2).max(50).required().trim(),
    suffix: Joi.string().max(10).optional().trim(),
    comment: Joi.string().max(500).optional().trim(),
    remarks: Joi.string().max(500).optional().trim(),
    
    // Contact Information
    email: Joi.string().email().required(),
    address: Joi.string().max(200).optional().trim(),
    city: Joi.string().max(100).optional().trim(),
    county: Joi.string().max(100).optional().trim(),
    state: Joi.string().max(50).optional().trim(),
    zipCode: Joi.string().max(20).optional().trim(),
    homePhone: Joi.string().max(20).optional().trim(),
    mobile: Joi.string().max(20).optional().trim(),
    workPhone: Joi.string().max(20).optional().trim(),
    otherPhone: Joi.string().max(20).optional().trim(),
    fax: Joi.string().max(20).optional().trim(),
    
    // CFS Information
    membershipType: Joi.string().optional().trim(),
    membershipAmount: Joi.number().min(0).optional(),
    jointMemberName: Joi.string().max(100).optional().trim(),
    
    // Additional Fields
    maidenOrOtherName: Joi.string().max(100).optional().trim(),
    
    // System Fields
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object<LoginRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }
  next();
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object<UpdateUserRequest>({
    // Main Information
    consultantId: Joi.string().uppercase().trim().optional(),
    entryDate: Joi.date().optional(),
    position: Joi.string().trim().optional(),
    status: Joi.string().valid('Active', 'Inactive').optional(),
    title: Joi.string().trim().optional(),
    firstName: Joi.string().min(2).max(50).trim().optional(),
    middleInitial: Joi.string().max(5).trim().optional(),
    lastName: Joi.string().min(2).max(50).trim().optional(),
    suffix: Joi.string().max(10).trim().optional(),
    comment: Joi.string().max(500).trim().optional(),
    remarks: Joi.string().max(500).trim().optional(),
    
    // Contact Information
    email: Joi.string().email().optional(),
    address: Joi.string().max(200).trim().optional(),
    city: Joi.string().max(100).trim().optional(),
    county: Joi.string().max(100).trim().optional(),
    state: Joi.string().max(50).trim().optional(),
    zipCode: Joi.string().max(20).trim().optional(),
    homePhone: Joi.string().max(20).trim().optional(),
    mobile: Joi.string().max(20).trim().optional(),
    workPhone: Joi.string().max(20).trim().optional(),
    otherPhone: Joi.string().max(20).trim().optional(),
    fax: Joi.string().max(20).trim().optional(),
    
    // CFS Information
    membershipType: Joi.string().trim().optional(),
    membershipAmount: Joi.number().min(0).optional(),
    jointMemberName: Joi.string().max(100).trim().optional(),
    
    // Additional Fields
    maidenOrOtherName: Joi.string().max(100).trim().optional(),
    
    // System Fields
    role: Joi.string().valid('Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA').optional(),
    isActive: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }
  next();
};

export const validateBulkUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    userIds: Joi.array().items(Joi.string()).min(1).required(),
    updates: Joi.object({
      // Main Information
      consultantId: Joi.string().uppercase().trim().optional(),
      entryDate: Joi.date().optional(),
      position: Joi.string().trim().optional(),
      status: Joi.string().valid('Active', 'Inactive').optional(),
      title: Joi.string().trim().optional(),
      firstName: Joi.string().min(2).max(50).trim().optional(),
      middleInitial: Joi.string().max(5).trim().optional(),
      lastName: Joi.string().min(2).max(50).trim().optional(),
      suffix: Joi.string().max(10).trim().optional(),
      comment: Joi.string().max(500).trim().optional(),
      remarks: Joi.string().max(500).trim().optional(),
      
      // Contact Information
      email: Joi.string().email().optional(),
      address: Joi.string().max(200).trim().optional(),
      city: Joi.string().max(100).trim().optional(),
      county: Joi.string().max(100).trim().optional(),
      state: Joi.string().max(50).trim().optional(),
      zipCode: Joi.string().max(20).trim().optional(),
      homePhone: Joi.string().max(20).trim().optional(),
      mobile: Joi.string().max(20).trim().optional(),
      workPhone: Joi.string().max(20).trim().optional(),
      otherPhone: Joi.string().max(20).trim().optional(),
      fax: Joi.string().max(20).trim().optional(),
      
      // CFS Information
      membershipType: Joi.string().trim().optional(),
      membershipAmount: Joi.number().min(0).optional(),
      jointMemberName: Joi.string().max(100).trim().optional(),
      
      // Additional Fields
      maidenOrOtherName: Joi.string().max(100).trim().optional(),
      
      // System Fields
      role: Joi.string().valid('Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA').optional(),
      isActive: Joi.boolean().optional()
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }
  next();
};