import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Complete Joi validation schema for Securia Client Creation
export const validateSecuriaClientCreation = (req: Request, res: Response, next: NextFunction): Response | void => {
  const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
  const zipRegex = /^\d{5}(-\d{4})?$/;
  const stateRegex = /^[A-Z]{2}$/;
  const clientIdRegex = /^CAN\d{5}$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  const nameInformationJoiSchema = Joi.object({
    title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.').optional(),
    first_name: Joi.string().required(),
    middle_initial: Joi.string().max(1).optional(),
    last_name: Joi.string().required(),
    suffix: Joi.string().valid('Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD').optional(),
    maiden_name: Joi.string().optional(),
    is_consultant: Joi.boolean().optional(),
  });

  const applicantJoiSchema = Joi.object({
    name_information: nameInformationJoiSchema.required(),
    contact: Joi.object({
      email: Joi.string().email().required(),
      address: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().pattern(stateRegex).optional(),
      zip_code: Joi.string().pattern(zipRegex).optional(),
      county: Joi.string().max(100).optional(),
      home_phone: Joi.string().pattern(phoneRegex).optional(),
      work_phone: Joi.string().pattern(phoneRegex).optional(),
      cell_phone: Joi.string().pattern(phoneRegex).optional(),
      other_phone: Joi.string().pattern(phoneRegex).optional(),
      fax: Joi.string().pattern(phoneRegex).allow('').optional(),
    }).required(),
    // All other fields optional
    date_of_birth: Joi.string().pattern(dateRegex).optional(),
    marital_status: Joi.string().valid('Single', 'Married', 'Divorced', 'Widowed', 'Separated').optional(),
    race: Joi.string().valid('American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races', 'Other').optional(),
    birth_place: Joi.string().optional(),
    anniversary: Joi.string().pattern(dateRegex).optional(),
    spouse_name: Joi.string().optional(),
    spouse_occupation: Joi.string().optional(),
    number_of_dependents: Joi.string().pattern(/^\d+$/).optional(),
    fax: Joi.string().pattern(phoneRegex).allow('').optional(),
    household_members: Joi.array().items(Joi.object({
      first_name: Joi.string().optional(),
      middle_initial: Joi.string().optional(),
      last_name: Joi.string().optional(),
      relationship: Joi.string().optional(),
      dob: Joi.string().optional(),
      age: Joi.string().optional(),
      sex: Joi.string().optional(),
      marital_status: Joi.string().optional(),
      ssn: Joi.string().optional(),
    })).optional(),
    current_address: Joi.object({
      months: Joi.number().min(0).max(11).optional(),
      years: Joi.number().min(0).optional(),
      how_long_at_current_address: Joi.string().optional(),
    }).optional(),
    previous_address: Joi.object({
      address: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().pattern(stateRegex).optional(),
      zip_code: Joi.string().pattern(zipRegex).optional(),
      months: Joi.number().min(0).max(11).optional(),
      years: Joi.number().min(0).optional(),
      duration: Joi.string().optional(),
    }).optional(),
    employment: Joi.object({
      status: Joi.string().valid('Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part time', 'Contract').optional(),
      is_business_owner: Joi.string().optional(),
      employer_name: Joi.string().optional(),
      employer_address: Joi.string().optional(),
      employer_city: Joi.string().optional(),
      employer_state: Joi.string().pattern(stateRegex).optional(),
      employer_zip_code: Joi.string().pattern(zipRegex).optional(),
      occupation: Joi.string().optional(),
      monthly_salary: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).optional(),
      other_income: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).optional(),
      start_date: Joi.string().pattern(dateRegex).optional(),
      end_date: Joi.string().pattern(dateRegex).optional(),
      supervisor: Joi.string().optional(),
      supervisor_phone: Joi.string().pattern(phoneRegex).optional(),
      source: Joi.string().optional(),
    }).optional(),
    previous_employment: Joi.object({
      employer_name: Joi.string().optional(),
      employer_address: Joi.string().optional(),
      employer_city: Joi.string().optional(),
      employer_state: Joi.string().pattern(stateRegex).optional(),
      employer_zip_code: Joi.string().pattern(zipRegex).optional(),
      from_date: Joi.string().pattern(dateRegex).optional(),
      to_date: Joi.string().pattern(dateRegex).optional(),
      occupation: Joi.string().optional(),
    }).optional(),
    credit_scores: Joi.object({
      equifax: Joi.string().pattern(/^\d+$/).optional(),
      experian: Joi.string().pattern(/^\d+$/).optional(),
      transunion: Joi.string().pattern(/^\d+$/).optional(),
    }).optional(),
  });

  const clientJoiSchema = Joi.object({
    applicant: applicantJoiSchema.required(),
    co_applicant: applicantJoiSchema.optional(),
    client_id: Joi.forbidden(),
    entry_date: Joi.string().pattern(dateRegex).required(),
    payoff_amount: Joi.number().min(0).required(),
    status: Joi.string().valid('Active', 'Pending', 'Inactive').required(),
    consultant_name: Joi.string().required(),
    processor_name: Joi.string().required(),
  });

  const { error } = clientJoiSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

// Validation for minimum required fields only (for partial saves)
export const validateMinimumClientFields = (req: Request, res: Response, next: NextFunction): Response | void => {
  const schema = Joi.object({
    basicInfo: Joi.object({
      firstName: Joi.string().min(2).max(50).required().trim(),
      lastName: Joi.string().min(2).max(50).required().trim()
    }).required(),
    
    contactInfo: Joi.object({
      email: Joi.string().email().max(100).required().trim().lowercase(),
      homePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      mobilePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      otherPhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim()
    }).required().custom((value, helpers) => {
      const { homePhone, mobilePhone, otherPhone } = value;
      if (!homePhone && !mobilePhone && !otherPhone) {
        return helpers.error('any.custom', { message: 'At least one phone number is required' });
      }
      return value;
    })
  }).unknown(true); // Allow other fields for partial updates

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Minimum validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

// Validation for client updates (all fields optional except ID)
export const validateClientUpdate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
  const zipRegex = /^\d{5}(-\d{4})?$/;
  const stateRegex = /^[A-Z]{2}$/;
  const clientIdRegex = /^CAN\d{5}$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  const nameInformationJoiSchema = Joi.object({
    title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.').optional(),
    first_name: Joi.string().required(),
    middle_initial: Joi.string().max(1).optional(),
    last_name: Joi.string().required(),
    suffix: Joi.string().valid('Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD').optional(),
    maiden_name: Joi.string().optional(),
    is_consultant: Joi.boolean().optional(),
  });

  const applicantJoiSchema = Joi.object({
    name_information: nameInformationJoiSchema.required(),
    contact: Joi.object({
      email: Joi.string().email().required(),
      address: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().pattern(stateRegex).optional(),
      zip_code: Joi.string().pattern(zipRegex).optional(),
      county: Joi.string().max(100).optional(),
      home_phone: Joi.string().pattern(phoneRegex).optional(),
      work_phone: Joi.string().pattern(phoneRegex).optional(),
      cell_phone: Joi.string().pattern(phoneRegex).optional(),
      other_phone: Joi.string().pattern(phoneRegex).optional(),
      fax: Joi.string().pattern(phoneRegex).allow('').optional(),
    }).required(),
    // All other fields optional
    date_of_birth: Joi.string().pattern(dateRegex).optional(),
    marital_status: Joi.string().valid('Single', 'Married', 'Divorced', 'Widowed', 'Separated').optional(),
    race: Joi.string().valid('American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races', 'Other').optional(),
    birth_place: Joi.string().optional(),
    anniversary: Joi.string().pattern(dateRegex).optional(),
    spouse_name: Joi.string().optional(),
    spouse_occupation: Joi.string().optional(),
    number_of_dependents: Joi.string().pattern(/^\d+$/).optional(),
    fax: Joi.string().pattern(phoneRegex).allow('').optional(),
    household_members: Joi.array().items(Joi.object({
      first_name: Joi.string().optional(),
      middle_initial: Joi.string().optional(),
      last_name: Joi.string().optional(),
      relationship: Joi.string().optional(),
      dob: Joi.string().optional(),
      age: Joi.string().optional(),
      sex: Joi.string().optional(),
      marital_status: Joi.string().optional(),
      ssn: Joi.string().optional(),
    })).optional(),
    current_address: Joi.object({
      address: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().pattern(stateRegex).optional(),
      zip_code: Joi.string().pattern(zipRegex).optional(),
      county: Joi.string().max(100).optional(),
      home_phone: Joi.string().pattern(phoneRegex).optional(),
      work_phone: Joi.string().pattern(phoneRegex).optional(),
      cell_phone: Joi.string().pattern(phoneRegex).optional(),
      other_phone: Joi.string().pattern(phoneRegex).optional(),
      email: Joi.string().email().optional(),
      months: Joi.number().min(0).max(11).optional(),
      years: Joi.number().min(0).optional(),
      how_long_at_current_address: Joi.string().optional(),
      fax: Joi.string().pattern(phoneRegex).allow('').optional(),
    }).optional(),
    previous_address: Joi.object({
      address: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().pattern(stateRegex).optional(),
      zip_code: Joi.string().pattern(zipRegex).optional(),
      months: Joi.number().min(0).max(11).optional(),
      years: Joi.number().min(0).optional(),
      duration: Joi.string().optional(),
    }).optional(),
    employment: Joi.object({
      status: Joi.string().valid('Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part time', 'Contract').optional(),
      is_business_owner: Joi.string().optional(),
      employer_name: Joi.string().optional(),
      employer_address: Joi.string().optional(),
      employer_city: Joi.string().optional(),
      employer_state: Joi.string().pattern(stateRegex).optional(),
      employer_zip_code: Joi.string().pattern(zipRegex).optional(),
      occupation: Joi.string().optional(),
      monthly_salary: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).optional(),
      other_income: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).optional(),
      start_date: Joi.string().pattern(dateRegex).optional(),
      end_date: Joi.string().pattern(dateRegex).optional(),
      supervisor: Joi.string().optional(),
      supervisor_phone: Joi.string().pattern(phoneRegex).optional(),
      source: Joi.string().optional(),
    }).optional(),
    previous_employment: Joi.object({
      employer_name: Joi.string().optional(),
      employer_address: Joi.string().optional(),
      employer_city: Joi.string().optional(),
      employer_state: Joi.string().pattern(stateRegex).optional(),
      employer_zip_code: Joi.string().pattern(zipRegex).optional(),
      from_date: Joi.string().pattern(dateRegex).optional(),
      to_date: Joi.string().pattern(dateRegex).optional(),
      occupation: Joi.string().optional(),
    }).optional(),
    credit_scores: Joi.object({
      equifax: Joi.string().pattern(/^\d+$/).optional(),
      experian: Joi.string().pattern(/^\d+$/).optional(),
      transunion: Joi.string().pattern(/^\d+$/).optional(),
    }).optional(),
  });

  const clientJoiSchema = Joi.object({
    applicant: applicantJoiSchema.required(),
    co_applicant: applicantJoiSchema.optional(),
    client_id: Joi.string().required(),
    entry_date: Joi.string().pattern(dateRegex).required(),
    payoff_amount: Joi.number().min(0).optional(),
    status: Joi.string().valid("inactive", "active","pending").optional(),
    consultant_name: Joi.string().optional().trim(),
    processor_name: Joi.string().optional().trim(),
  }).unknown(true); // Allow any other fields for updates

  const { error } = clientJoiSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Update validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};