import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

// Validation schemas for each section of the multi-stage client form

// Required Applicant Basic Info Schema
const RequiredApplicantBasicInfoSchema = Joi.object({
  title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.').optional(),
  firstName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required'
  }),
  mi: Joi.string().trim().max(1).optional(),
  lastName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required'
  }),
  suffix: Joi.string().valid('Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD').optional(),
  maidenName: Joi.string().trim().max(50).optional(),
  isConsultant: Joi.boolean().default(false),
  homePhone: Joi.string().trim().optional(),
  workPhone: Joi.string().trim().optional(),
  cellPhone: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Cell phone is required',
    'any.required': 'Cell phone is required'
  }),
  otherPhone: Joi.string().trim().optional(),
  fax: Joi.string().trim().optional(),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  })
});

// Required Applicant Address Schema
const RequiredApplicantAddressSchema = Joi.object({
  currentAddress: Joi.object({
    street: Joi.string().trim().min(1).max(200).required().messages({
      'string.empty': 'Street address is required',
      'any.required': 'Street address is required'
    }),
    city: Joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'City is required',
      'any.required': 'City is required'
    }),
    state: Joi.string().trim().max(50).optional(),
    zipCode: Joi.string().trim().pattern(/^\d{5}(-\d{4})?$/).optional(),
    county: Joi.string().trim().max(100).optional(),
    howLongYears: Joi.number().min(0).default(0),
    howLongMonths: Joi.number().min(0).max(11).default(0)
  }).required(),
  previousAddress: Joi.object({
    street: Joi.string().trim().max(200).optional(),
    city: Joi.string().trim().max(100).optional(),
    state: Joi.string().trim().max(50).optional(),
    zipCode: Joi.string().trim().pattern(/^\d{5}(-\d{4})?$/).optional(),
    howLongYears: Joi.number().min(0).default(0),
    howLongMonths: Joi.number().min(0).max(11).default(0)
  }).optional()
});

// Required Co-Applicant Basic Info Schema
const RequiredCoApplicantBasicInfoSchema = Joi.object({
  includeCoApplicant: Joi.boolean().default(false),
  title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.').optional(),
  firstName: Joi.when('includeCoApplicant', {
    is: true,
    then: Joi.string().trim().min(1).max(50).required().messages({
      'string.empty': 'Co-applicant first name is required',
      'any.required': 'Co-applicant first name is required'
    }),
    otherwise: Joi.string().trim().max(50).optional()
  }),
  mi: Joi.string().trim().max(1).optional(),
  lastName: Joi.when('includeCoApplicant', {
    is: true,
    then: Joi.string().trim().min(1).max(50).required().messages({
      'string.empty': 'Co-applicant last name is required',
      'any.required': 'Co-applicant last name is required'
    }),
    otherwise: Joi.string().trim().max(50).optional()
  }),
  suffix: Joi.string().valid('Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD').optional(),
  maidenName: Joi.string().trim().max(50).optional(),
  isConsultant: Joi.boolean().default(false),
  homePhone: Joi.string().trim().optional(),
  workPhone: Joi.string().trim().optional(),
  cellPhone: Joi.when('includeCoApplicant', {
    is: true,
    then: Joi.string().trim().min(1).required().messages({
      'string.empty': 'Co-applicant cell phone is required',
      'any.required': 'Co-applicant cell phone is required'
    }),
    otherwise: Joi.string().trim().optional()
  }),
  otherPhone: Joi.string().trim().optional(),
  fax: Joi.string().trim().optional(),
  email: Joi.when('includeCoApplicant', {
    is: true,
    then: Joi.string().trim().email().required().messages({
      'string.empty': 'Co-applicant email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Co-applicant email is required'
    }),
    otherwise: Joi.string().trim().email().optional()
  })
});

// Required Co-Applicant Address Schema
const RequiredCoApplicantAddressSchema = Joi.object({
  currentAddress: Joi.object({
    street: Joi.string().trim().min(1).max(200).required().messages({
      'string.empty': 'Co-applicant street address is required',
      'any.required': 'Co-applicant street address is required'
    }),
    city: Joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'Co-applicant city is required',
      'any.required': 'Co-applicant city is required'
    }),
    state: Joi.string().trim().max(50).optional(),
    zipCode: Joi.string().trim().pattern(/^\d{5}(-\d{4})?$/).optional(),
    county: Joi.string().trim().max(100).optional(),
    howLongYears: Joi.number().min(0).default(0),
    howLongMonths: Joi.number().min(0).max(11).default(0)
  }).required(),
  previousAddress: Joi.object({
    street: Joi.string().trim().max(200).optional(),
    city: Joi.string().trim().max(100).optional(),
    state: Joi.string().trim().max(50).optional(),
    zipCode: Joi.string().trim().pattern(/^\d{5}(-\d{4})?$/).optional(),
    howLongYears: Joi.number().min(0).default(0),
    howLongMonths: Joi.number().min(0).max(11).default(0)
  }).optional()
});

const AddressSchema = Joi.object({
  street: Joi.string().trim().max(200).optional(),
  city: Joi.string().trim().max(100).optional(),
  county: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(50).optional(),
  zipCode: Joi.string().trim().pattern(/^\d{5}(-\d{4})?$/).optional(),
  country: Joi.string().trim().max(50).default('USA').optional()
});

const EmploymentSchema = Joi.object({
  employerName: Joi.string().trim().max(200).optional(),
  position: Joi.string().trim().max(100).optional(),
  workPhone: Joi.string().trim().optional(),
  yearsAtJob: Joi.number().min(0).optional(),
  monthlyIncome: Joi.number().min(0).optional(),
  annualIncome: Joi.number().min(0).optional(),
  employmentType: Joi.string().valid('Full-time', 'Part-time', 'Self-employed', 'Retired', 'Unemployed').optional()
});

const DemographicsSchema = Joi.object({
  dateOfBirth: Joi.date().optional(),
  age: Joi.number().min(0).max(150).optional(),
  ssn: Joi.string().trim().optional(),
  sex: Joi.string().valid('Male', 'Female', 'Other').optional(),
  maritalStatus: Joi.string().valid('Single', 'Married', 'Divorced', 'Widowed', 'Separated').optional(),
  race: Joi.string().trim().optional(),
  ethnicity: Joi.string().trim().optional()
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
  mobilePhone: Joi.string().trim().optional(),
  otherPhone: Joi.string().trim().optional(),
  fax: Joi.string().trim().optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  
  address: AddressSchema.optional(),
  employment: EmploymentSchema.optional(),
  demographics: DemographicsSchema.optional(),
  householdMembers: Joi.array().items(HouseholdMemberSchema).optional()
});

const CoApplicantSchema = Joi.object({
  hasCoApplicant: Joi.boolean().default(false).optional(),
  title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.').optional(),
  firstName: Joi.string().trim().max(50).optional(),
  mi: Joi.string().trim().max(1).optional(),
  lastName: Joi.string().trim().max(50).optional(),
  suffix: Joi.string().valid('Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD').optional(),
  maidenName: Joi.string().trim().max(50).optional(),
  isConsultant: Joi.boolean().default(false).optional(),
  
  homePhone: Joi.string().trim().optional(),
  mobilePhone: Joi.string().trim().optional(),
  otherPhone: Joi.string().trim().optional(),
  fax: Joi.string().trim().optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  
  address: AddressSchema.optional(),
  employment: EmploymentSchema.optional(),
  demographics: DemographicsSchema.optional(),
  householdMembers: Joi.array().items(HouseholdMemberSchema).optional()
});

const LiabilitySchema = Joi.object({
  debtorType: Joi.string().valid('Applicant', 'Co-Applicant', 'Joint').optional(),
  liabilityType: Joi.string().trim().optional(),
  creditorName: Joi.string().trim().optional(),
  currentBalance: Joi.number().min(0).optional(),
  monthlyPayment: Joi.number().min(0).optional(),
  payOff: Joi.boolean().default(false).optional(),
  propertyAddress: Joi.string().trim().optional(),
  propertyValue: Joi.number().min(0).optional(),
  grossRent: Joi.number().min(0).optional(),
  escrow: Joi.string().trim().optional(),
  taxes: Joi.number().min(0).optional(),
  hoi: Joi.number().min(0).optional(),
  totalEscrow: Joi.number().min(0).optional(),
  netRent: Joi.number().optional()
});

const MortgageSchema = Joi.object({
  propertyAddress: Joi.string().trim().optional(),
  lender: Joi.string().trim().optional(),
  originalAmount: Joi.number().min(0).optional(),
  currentBalance: Joi.number().min(0).optional(),
  monthlyPayment: Joi.number().min(0).optional(),
  interestRate: Joi.number().min(0).max(100).optional(),
  loanType: Joi.string().trim().optional(),
  propertyValue: Joi.number().min(0).optional(),
  rentalIncome: Joi.number().min(0).optional()
});

const UnderwritingSchema = Joi.object({
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  clientId: Joi.string().trim().optional(),
  creditScore: Joi.number().min(300).max(850).optional(),
  annualIncome: Joi.number().min(0).optional(),
  monthlyIncome: Joi.number().min(0).optional(),
  debtToIncomeRatio: Joi.number().min(0).max(100).optional(),
  assets: Joi.number().min(0).optional(),
  liabilities: Joi.number().min(0).optional(),
  netWorth: Joi.number().optional(),
  loanAmount: Joi.number().min(0).optional(),
  loanToValueRatio: Joi.number().min(0).max(100).optional(),
  propertyValue: Joi.number().min(0).optional(),
  downPayment: Joi.number().min(0).optional(),
  cashReserves: Joi.number().min(0).optional(),
  employmentHistory: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional()
});

const LoanStatusSchema = Joi.object({
  applicationDate: Joi.date().optional(),
  status: Joi.string().valid('Pre-Approval', 'Application Submitted', 'Under Review', 'Approved', 'Denied', 'Funded').optional(),
  loanType: Joi.string().valid('Conventional', 'FHA', 'VA', 'USDA', 'Jumbo').optional(),
  loanAmount: Joi.number().min(0).optional(),
  interestRate: Joi.number().min(0).max(100).optional(),
  term: Joi.number().min(1).max(50).optional(),
  closingDate: Joi.date().optional(),
  lender: Joi.string().trim().optional(),
  loanOfficer: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional()
});

const DriverSchema = Joi.object({
  fullName: Joi.string().trim().optional(),
  dateOfBirth: Joi.date().optional(),
  age: Joi.number().min(0).max(150).optional(),
  relationship: Joi.string().trim().optional(),
  ssn: Joi.string().trim().optional(),
  sex: Joi.string().valid('Male', 'Female', 'Other').optional(),
  maritalStatus: Joi.string().valid('Single', 'Married', 'Divorced', 'Widowed', 'Separated').optional(),
  drivingStatus: Joi.string().valid('Licensed', 'Permit', 'No License', 'Suspended').optional(),
  licenseNumber: Joi.string().trim().optional(),
  licenseState: Joi.string().trim().optional(),
  accidentsViolations: Joi.boolean().default(false).optional(),
  explanation: Joi.string().trim().optional()
});

const VehicleSchema = Joi.object({
  year: Joi.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  make: Joi.string().trim().optional(),
  model: Joi.string().trim().optional(),
  vin: Joi.string().trim().optional(),
  usage: Joi.string().valid('Personal', 'Business', 'Farm').optional(),
  annualMileage: Joi.number().min(0).optional(),
  coverage: Joi.object({
    liability: Joi.boolean().default(false).optional(),
    collision: Joi.boolean().default(false).optional(),
    comprehensive: Joi.boolean().default(false).optional()
  }).optional()
});

const VehicleCoverageSchema = Joi.object({
  hasVehicles: Joi.boolean().default(false).optional(),
  currentProvider: Joi.string().trim().optional(),
  policyNumber: Joi.string().trim().optional(),
  coverageLimits: Joi.object({
    liability: Joi.string().trim().optional(),
    collision: Joi.string().trim().optional(),
    comprehensive: Joi.string().trim().optional(),
    uninsuredMotorist: Joi.string().trim().optional()
  }).optional(),
  vehicles: Joi.array().items(VehicleSchema).optional()
});

const HomeownersSchema = Joi.object({
  hasHomeInsurance: Joi.boolean().default(false).optional(),
  provider: Joi.string().trim().optional(),
  policyNumber: Joi.string().trim().optional(),
  coverageAmount: Joi.number().min(0).optional(),
  deductible: Joi.number().min(0).optional(),
  annualPremium: Joi.number().min(0).optional(),
  propertyValue: Joi.number().min(0).optional(),
  mortgageCompany: Joi.string().trim().optional(),
  additionalCoverage: Joi.array().items(Joi.object({
    type: Joi.string().trim().optional(),
    amount: Joi.number().min(0).optional()
  })).optional()
});

const RentersSchema = Joi.object({
  hasRentersInsurance: Joi.boolean().default(false).optional(),
  provider: Joi.string().trim().optional(),
  policyNumber: Joi.string().trim().optional(),
  coverageAmount: Joi.number().min(0).optional(),
  deductible: Joi.number().min(0).optional(),
  annualPremium: Joi.number().min(0).optional(),
  personalProperty: Joi.number().min(0).optional(),
  liability: Joi.number().min(0).optional(),
  additionalLiving: Joi.number().min(0).optional()
});

const BeneficiarySchema = Joi.object({
  name: Joi.string().trim().optional(),
  relationship: Joi.string().trim().optional(),
  percentage: Joi.number().min(0).max(100).optional()
});

const LifeInsuranceSchema = Joi.object({
  provider: Joi.string().trim().optional(),
  policyNumber: Joi.string().trim().optional(),
  faceAmount: Joi.number().min(0).optional(),
  premiumAmount: Joi.number().min(0).optional(),
  premiumFrequency: Joi.string().valid('Monthly', 'Quarterly', 'Semi-Annual', 'Annual').optional(),
  beneficiaries: Joi.array().items(BeneficiarySchema).optional()
});

const IncomeProtectionSchema = Joi.object({
  hasIncomeProtection: Joi.boolean().default(false).optional(),
  shortTermDisability: Joi.object({
    provider: Joi.string().trim().optional(),
    policyNumber: Joi.string().trim().optional(),
    monthlyBenefit: Joi.number().min(0).optional(),
    eliminationPeriod: Joi.number().min(0).optional(),
    benefitPeriod: Joi.number().min(0).optional()
  }).optional(),
  longTermDisability: Joi.object({
    provider: Joi.string().trim().optional(),
    policyNumber: Joi.string().trim().optional(),
    monthlyBenefit: Joi.number().min(0).optional(),
    eliminationPeriod: Joi.number().min(0).optional(),
    benefitPeriod: Joi.string().trim().optional()
  }).optional(),
  lifeInsurance: Joi.array().items(LifeInsuranceSchema).optional()
});

const RetirementAccountSchema = Joi.object({
  accountType: Joi.string().valid('401k', '403b', 'IRA', 'Roth IRA', 'Pension', 'Other').optional(),
  provider: Joi.string().trim().optional(),
  currentBalance: Joi.number().min(0).optional(),
  monthlyContribution: Joi.number().min(0).optional(),
  employerMatch: Joi.number().min(0).optional(),
  vestingSchedule: Joi.string().trim().optional()
});

const RetirementSchema = Joi.object({
  hasRetirementAccounts: Joi.boolean().default(false).optional(),
  currentAge: Joi.number().min(0).max(150).optional(),
  desiredRetirementAge: Joi.number().min(50).max(100).optional(),
  estimatedRetirementIncome: Joi.number().min(0).optional(),
  currentRetirementSavings: Joi.number().min(0).optional(),
  monthlyContribution: Joi.number().min(0).optional(),
  employerMatch: Joi.number().min(0).optional(),
  retirementAccounts: Joi.array().items(RetirementAccountSchema).optional(),
  retirementGoals: Joi.object({
    monthlyIncomeNeeded: Joi.number().min(0).optional(),
    inflationRate: Joi.number().min(0).max(20).optional(),
    rateOfReturn: Joi.number().min(0).max(50).optional(),
    retirementDuration: Joi.number().min(1).max(100).optional()
  }).optional()
});

const LineageSchema = Joi.object({
  referralSource: Joi.string().valid('Website', 'Referral', 'Advertisement', 'Social Media', 'Other').optional(),
  referredBy: Joi.string().trim().optional(),
  referrerContact: Joi.string().trim().optional(),
  originalContactDate: Joi.date().optional(),
  leadSource: Joi.string().trim().optional(),
  marketingCampaign: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
  consultantAssigned: Joi.string().optional(), // ObjectId as string
  consultantNotes: Joi.string().trim().optional()
});

// Main multi-stage client validation schema
const MultiStageClientSchema = Joi.object({
  applicant: ApplicantSchema.optional(),
  coApplicant: CoApplicantSchema.optional(),
  liabilities: Joi.array().items(LiabilitySchema).optional(),
  mortgages: Joi.array().items(MortgageSchema).optional(),
  underwriting: UnderwritingSchema.optional(),
  loanStatus: LoanStatusSchema.optional(),
  drivers: Joi.array().items(DriverSchema).optional(),
  vehicleCoverage: VehicleCoverageSchema.optional(),
  homeowners: HomeownersSchema.optional(),
  renters: RentersSchema.optional(),
  incomeProtection: IncomeProtectionSchema.optional(),
  retirement: RetirementSchema.optional(),
  lineage: LineageSchema.optional(),
  
  // Legacy fields for backward compatibility
  firstName: Joi.string().trim().max(50).optional(),
  lastName: Joi.string().trim().max(50).optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  phone: Joi.string().trim().optional(),
  dateOfBirth: Joi.date().optional(),
  ssn: Joi.string().trim().optional(),
  address: AddressSchema.optional(),
  consultantId: Joi.string().optional()
});

// Section update validation schema
const SectionUpdateSchema = Joi.object({
  section: Joi.string().valid(
    'applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 
    'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 
    'incomeProtection', 'retirement', 'lineage'
  ).required(),
  data: Joi.object().required()
});

// Bulk update validation schema
const BulkUpdateSchema = Joi.object({
  sections: Joi.object().pattern(
    Joi.string().valid(
      'applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 
      'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 
      'incomeProtection', 'retirement', 'lineage'
    ),
    Joi.object()
  ).required()
});

// Validation middleware functions

export const validateMultiStageClient = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = MultiStageClientSchema.validate(req.body, { 
    allowUnknown: true,
    stripUnknown: false 
  });
  
  if (error) {
    res.status(400).json({ 
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  next();
};

export const validateSectionUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = SectionUpdateSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({ 
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  next();
};

export const validateBulkUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = BulkUpdateSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({ 
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  next();
};

// Individual section validation functions
export const validateApplicantSection = (data: any) => ApplicantSchema.validate(data);
export const validateCoApplicantSection = (data: any) => CoApplicantSchema.validate(data);
export const validateLiabilitiesSection = (data: any) => Joi.array().items(LiabilitySchema).validate(data);
export const validateMortgagesSection = (data: any) => Joi.array().items(MortgageSchema).validate(data);
export const validateUnderwritingSection = (data: any) => UnderwritingSchema.validate(data);
export const validateLoanStatusSection = (data: any) => LoanStatusSchema.validate(data);
export const validateDriversSection = (data: any) => Joi.array().items(DriverSchema).validate(data);
export const validateVehicleCoverageSection = (data: any) => VehicleCoverageSchema.validate(data);
export const validateHomeownersSection = (data: any) => HomeownersSchema.validate(data);
export const validateRentersSection = (data: any) => RentersSchema.validate(data);
export const validateIncomeProtectionSection = (data: any) => IncomeProtectionSchema.validate(data);
export const validateRetirementSection = (data: any) => RetirementSchema.validate(data);
export const validateLineageSection = (data: any) => LineageSchema.validate(data);

// Validation functions for required applicant and co-applicant fields
export const validateRequiredApplicantBasicInfo = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = RequiredApplicantBasicInfoSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  next();
};

export const validateRequiredApplicantAddress = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = RequiredApplicantAddressSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  next();
};

export const validateRequiredCoApplicantBasicInfo = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = RequiredCoApplicantBasicInfoSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  next();
};

export const validateRequiredCoApplicantAddress = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = RequiredCoApplicantAddressSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  next();
};

// Optional validation for employment and demographics (no required fields)
export const validateOptionalApplicantEmployment = (req: Request, res: Response, next: NextFunction): void => {
  // No required fields, just pass through
  next();
};

export const validateOptionalApplicantDemographics = (req: Request, res: Response, next: NextFunction): void => {
  // No required fields, just pass through
  next();
};

export const validateOptionalCoApplicantEmployment = (req: Request, res: Response, next: NextFunction): void => {
  // No required fields, just pass through
  next();
};

export const validateOptionalCoApplicantDemographics = (req: Request, res: Response, next: NextFunction): void => {
  // No required fields, just pass through
  next();
};
