import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

// Address, Employment, Demographics, HouseholdMember, etc. schemas (nested only)
const AddressSchema = Joi.object({
  street: Joi.string().trim().max(200).optional(),
  city: Joi.string().trim().max(100).optional(),
  county: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(50).optional(),
  zipCode: Joi.string().trim().pattern(/^\d{5}(-\d{4})?$/).optional(),
  country: Joi.string().trim().max(50).default('USA').optional()
});

const EmploymentSchema = Joi.object({
  status: Joi.string().optional(),
  isBusinessOwner: Joi.boolean().optional(),
  employerName: Joi.string().trim().max(200).optional(),
  employerAddress: AddressSchema.optional(),
  occupation: Joi.string().trim().max(100).optional(),
  monthlySalary: Joi.number().min(0).optional(),
  employerPhone: Joi.string().trim().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  additionalIncome: Joi.number().optional(),
  additionalIncomeSource: Joi.string().optional(),
  supervisor: Joi.string().optional()
});

const DemographicsSchema = Joi.object({
  dateOfBirth: Joi.date().optional(),
  ssn: Joi.string().trim().optional(),
  birthPlace: Joi.string().trim().optional(),
  race: Joi.string().trim().optional(),
  maritalStatus: Joi.string().trim().optional(),
  anniversary: Joi.date().optional(),
  spouseName: Joi.string().trim().optional(),
  spouseOccupation: Joi.string().trim().optional(),
  numberOfDependents: Joi.number().optional()
});

const HouseholdMemberSchema = Joi.object({
  name: Joi.string().trim().max(100).optional(),
  relationship: Joi.string().trim().max(50).optional(),
  dateOfBirth: Joi.date().optional(),
  age: Joi.number().min(0).max(150).optional(),
  ssn: Joi.string().trim().optional(),
  sex: Joi.string().valid('Male', 'Female', 'Other').optional()
});

const ApplicantSchema = Joi.object({
  title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.').optional(),
  firstName: Joi.string().trim().max(50).optional(),
  mi: Joi.string().trim().max(1).optional(),
  lastName: Joi.string().trim().max(50).optional(),
  suffix: Joi.string().valid('Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD').optional(),
  maidenName: Joi.string().trim().max(50).optional(),
  isConsultant: Joi.boolean().default(false).optional(),
  homePhone: Joi.string().trim().optional(),
  workPhone: Joi.string().trim().optional(),
  cellPhone: Joi.string().trim().optional(),
  fax: Joi.string().trim().optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  currentAddress: AddressSchema.optional(),
  previousAddress: AddressSchema.optional(),
  employment: EmploymentSchema.optional(),
  demographics: DemographicsSchema.optional(),
  householdMembers: Joi.array().items(HouseholdMemberSchema).optional()
});

const CoApplicantSchema = ApplicantSchema;

const MultiStageClientSchema = Joi.object({
  applicant: ApplicantSchema.optional(),
  coApplicant: CoApplicantSchema.optional(),
  // Add other nested sections as needed (liabilities, mortgages, etc.)
});

const CoApplicantIncludeOnlySchema = Joi.object({
  include_coapplicant: Joi.boolean().valid(false).required()
});

export const validateMultiStageClient = (req: Request, res: Response, next: NextFunction): void => {
  // Custom coApplicant validation logic
  let coApplicantError = null;
  if (req.body.coApplicant) {
    if (req.body.coApplicant.include_coapplicant === false) {
      const { error } = CoApplicantIncludeOnlySchema.validate(req.body.coApplicant, {
        allowUnknown: false,
        stripUnknown: true
      });
      if (error) coApplicantError = error;
    } else {
      const { error } = CoApplicantSchema.validate(req.body.coApplicant, {
        allowUnknown: false,
        stripUnknown: true
      });
      if (error) coApplicantError = error;
    }
  }
  // Validate the rest of the client (applicant, etc.)
  const { error: mainError } = ApplicantSchema.validate(req.body.applicant, {
    allowUnknown: false,
    stripUnknown: true
  });
  if (mainError || coApplicantError) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: [
        ...(mainError ? mainError.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) : []),
        ...(coApplicantError ? coApplicantError.details.map(detail => ({ field: 'coApplicant.' + detail.path.join('.'), message: detail.message })) : [])
      ]
    });
    return;
  }
  next();
};
