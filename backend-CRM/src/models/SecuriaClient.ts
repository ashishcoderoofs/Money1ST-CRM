import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key-here';
const ALGORITHM = 'aes-256-cbc';

export interface ISecuriaClient extends Document {
  // Auto-generated fields
  clientId?: string;
  completionPercentage?: number;
  status?: 'draft' | 'submitted' | 'active' | 'inactive';
  createdBy?: string;
  lastModifiedBy?: string;
  
  // 1. Applicant Information (Primary)
  applicant?: {
    // Basic Info
    title?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.';
    firstName?: string;
    mi?: string; // Middle Initial
    lastName?: string;
    suffix?: 'Jr.' | 'Sr.' | 'II' | 'III' | 'IV' | 'V' | 'MD' | 'PhD';
    maidenName?: string;
    isConsultant?: boolean;
    
    // Contact Info
    homePhone?: string;
    workPhone?: string;
    cellPhone?: string;
    otherPhone?: string;
    fax?: string;
    email?: string;
    
    // Current Address
    currentAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      county?: string;
      howLongYears?: number;
      howLongMonths?: number;
    };
    
    // Previous Address (if less than 2 years at current)
    previousAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      howLongYears?: number;
      howLongMonths?: number;
    };
    
    // Current Employment Information
    employment?: {
      employmentStatus?: 'Employed' | 'Full-time' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student' | 'Part-Time' | 'Contract';
      isBusinessOwner?: boolean;
      occupation?: string;
      employerName?: string;
      employerAddress?: string;
      employerCity?: string;
      employerState?: string;
      employerZipCode?: string;
      monthlyGrossSalary?: number;
      startDate?: Date;
      endDate?: Date;
      supervisor?: string;
      supervisorPhone?: string;
      additionalIncome?: number;
      source?: string;
    };
    
    // Previous Employment
    previousEmployment?: {
      employerName?: string;
      employerAddress?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      occupation?: string;
      fromDate?: Date;
      toDate?: Date;
    };
    
    // Demographics
    demographics?: {
      birthPlace?: string;
      dateOfBirth?: Date;
      ssn?: string;
      race?: 'American Indian' | 'Asian' | 'Black/African American' | 'Hispanic/Latino' | 'Native Hawaiian' | 'White' | 'Other' | 'Decline to Answer';
      maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
      anniversary?: Date;
      spouseName?: string;
      spouseOccupation?: string;
      numberOfDependents?: number;
    };
  };
  
  // 2. Co-Applicant Information (Enhanced)
  coApplicant?: {
    includeCoApplicant?: boolean;
    
    // Basic Info
    title?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.';
    firstName?: string;
    mi?: string; // Middle Initial
    lastName?: string;
    suffix?: 'Jr.' | 'Sr.' | 'II' | 'III' | 'IV' | 'V' | 'MD' | 'PhD';
    maidenName?: string;
    isConsultant?: boolean;
    
    // Contact Info
    homePhone?: string;
    workPhone?: string;
    cellPhone?: string;
    otherPhone?: string;
    fax?: string;
    email?: string;
    
    // Current Address
    currentAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      county?: string;
      howLongYears?: number;
      howLongMonths?: number;
    };
    
    // Previous Address (if less than 2 years at current)
    previousAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      howLongYears?: number;
      howLongMonths?: number;
    };
    
    // Current Employment Information
    employment?: {
      employmentStatus?: 'Employed' | 'Full-time' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student' | 'Part-Time' | 'Contract';
      isBusinessOwner?: boolean;
      occupation?: string;
      employerName?: string;
      employerAddress?: string;
      employerCity?: string;
      employerState?: string;
      employerZipCode?: string;
      monthlyGrossSalary?: number;
      startDate?: Date;
      endDate?: Date;
      supervisor?: string;
      supervisorPhone?: string;
      additionalIncome?: number;
      source?: string;
    };
    
    // Previous Employment
    previousEmployment?: {
      employerName?: string;
      employerAddress?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      occupation?: string;
      fromDate?: Date;
      toDate?: Date;
    };
    
    // Demographics
    demographics?: {
      birthPlace?: string;
      dateOfBirth?: Date;
      race?: 'American Indian' | 'Asian' | 'Black/African American' | 'Hispanic/Latino' | 'Native Hawaiian' | 'White' | 'Other' | 'Decline to Answer';
      maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
      anniversary?: Date;
      spouseName?: string;
      spouseOccupation?: string;
      numberOfDependents?: number;
    };
  };
  
  // 3. Liabilities
  liabilities?: Array<{
    debtorType?: 'Applicant' | 'Co-Applicant' | 'Joint';
    liabilityType?: string;
    creditorName?: string;
    currentBalance?: number;
    monthlyPayment?: number;
    payOff?: boolean;
    propertyAddress?: string;
    propertyValue?: number;
    grossRent?: number;
    escrow?: string;
    taxes?: number;
    hoi?: number; // Homeowner Insurance
    totalEscrow?: number;
    netRent?: number;
  }>;
  
  // 4. Mortgages
  mortgages?: Array<{
    propertyAddress?: string;
    lender?: string;
    originalAmount?: number;
    currentBalance?: number;
    monthlyPayment?: number;
    interestRate?: number;
    loanType?: string;
    propertyValue?: number;
    rentalIncome?: number;
  }>;
  
  // 5. Underwriting
  underwriting?: {
    address?: string;
    city?: string;
    clientId?: string;
    creditScore?: number;
    annualIncome?: number;
    monthlyIncome?: number;
    debtToIncomeRatio?: number;
    assets?: number;
    liabilities?: number;
    netWorth?: number;
    loanAmount?: number;
    loanToValueRatio?: number;
    propertyValue?: number;
    downPayment?: number;
    cashReserves?: number;
    employmentHistory?: string;
    notes?: string;
  };
  
  // 6. Loan Status
  loanStatus?: {
    applicationDate?: Date;
    status?: 'Pre-Approval' | 'Application Submitted' | 'Under Review' | 'Approved' | 'Denied' | 'Funded';
    loanType?: 'Conventional' | 'FHA' | 'VA' | 'USDA' | 'Jumbo';
    loanAmount?: number;
    interestRate?: number;
    term?: number; // in years
    closingDate?: Date;
    lender?: string;
    loanOfficer?: string;
    notes?: string;
  };
  
  // 7. Drivers
  drivers?: Array<{
    fullName?: string;
    dateOfBirth?: Date;
    age?: number;
    relationship?: string;
    ssn?: string;
    sex?: 'Male' | 'Female' | 'Other';
    maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
    drivingStatus?: 'Licensed' | 'Permit' | 'No License' | 'Suspended';
    licenseNumber?: string;
    licenseState?: string;
    accidentsViolations?: boolean;
    explanation?: string;
  }>;
  
  // 8. Vehicle Coverage
  vehicleCoverage?: {
    hasVehicles?: boolean;
    currentProvider?: string;
    policyNumber?: string;
    coverageLimits?: {
      liability?: string;
      collision?: string;
      comprehensive?: string;
      uninsuredMotorist?: string;
    };
    vehicles?: Array<{
      year?: number;
      make?: string;
      model?: string;
      vin?: string;
      usage?: 'Personal' | 'Business' | 'Farm';
      annualMileage?: number;
      coverage?: {
        liability?: boolean;
        collision?: boolean;
        comprehensive?: boolean;
      };
    }>;
  };
  
  // 9. Homeowners Insurance
  homeowners?: {
    hasHomeInsurance?: boolean;
    provider?: string;
    policyNumber?: string;
    coverageAmount?: number;
    deductible?: number;
    annualPremium?: number;
    propertyValue?: number;
    mortgageCompany?: string;
    additionalCoverage?: Array<{
      type?: string;
      amount?: number;
    }>;
  };
  
  // 10. Renters Insurance
  renters?: {
    hasRentersInsurance?: boolean;
    provider?: string;
    policyNumber?: string;
    coverageAmount?: number;
    deductible?: number;
    annualPremium?: number;
    personalProperty?: number;
    liability?: number;
    additionalLiving?: number;
  };
  
  // 11. Income Protection
  incomeProtection?: {
    hasIncomeProtection?: boolean;
    shortTermDisability?: {
      provider?: string;
      policyNumber?: string;
      monthlyBenefit?: number;
      eliminationPeriod?: number; // days
      benefitPeriod?: number; // months
    };
    longTermDisability?: {
      provider?: string;
      policyNumber?: string;
      monthlyBenefit?: number;
      eliminationPeriod?: number; // days
      benefitPeriod?: string; // 'Age 65', 'Lifetime', etc.
    };
    lifeInsurance?: Array<{
      provider?: string;
      policyNumber?: string;
      faceAmount?: number;
      premiumAmount?: number;
      premiumFrequency?: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
      beneficiaries?: Array<{
        name?: string;
        relationship?: string;
        percentage?: number;
      }>;
    }>;
  };
  
  // 12. Retirement
  retirement?: {
    hasRetirementAccounts?: boolean;
    currentAge?: number;
    desiredRetirementAge?: number;
    estimatedRetirementIncome?: number;
    currentRetirementSavings?: number;
    monthlyContribution?: number;
    employerMatch?: number;
    retirementAccounts?: Array<{
      accountType?: '401k' | '403b' | 'IRA' | 'Roth IRA' | 'Pension' | 'Other';
      provider?: string;
      currentBalance?: number;
      monthlyContribution?: number;
      employerMatch?: number;
      vestingSchedule?: string;
    }>;
    retirementGoals?: {
      monthlyIncomeNeeded?: number;
      inflationRate?: number;
      rateOfReturn?: number;
      retirementDuration?: number; // years
    };
  };
  
  // 13. Lineage (Referral/Source Tracking)
  lineage?: {
    referralSource?: 'Website' | 'Referral' | 'Advertisement' | 'Social Media' | 'Other';
    referredBy?: string;
    referrerContact?: string;
    originalContactDate?: Date;
    leadSource?: string;
    marketingCampaign?: string;
    notes?: string;
    consultantAssigned?: mongoose.Types.ObjectId;
    consultantNotes?: string;
  };
  
  // Methods
  encryptSSN(ssn: string): string;
  decryptSSN(): string;
}

const AddressSchema = new Schema({
  street: {
    type: String,
    trim: true,
    maxlength: [200, 'Street address cannot exceed 200 characters']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [100, 'City cannot exceed 100 characters']
  },
  state: {
    type: String,
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  zipCode: {
    type: String,
    trim: true,
    match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid zip code']
  },
  country: {
    type: String,
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters'],
    default: 'USA'
  }
}, { _id: false });

const FinancialInfoSchema = new Schema({
  annualIncome: {
    type: Number,
    min: [0, 'Annual income cannot be negative']
  },
  netWorth: {
    type: Number
  },
  investmentGoals: {
    type: String,
    trim: true,
    maxlength: [1000, 'Investment goals cannot exceed 1000 characters']
  },
  riskTolerance: {
    type: String,
    enum: ['low', 'medium', 'high']
  }
}, { _id: false });

const SecuriaClientSchema = new Schema<ISecuriaClient>({
  // Auto-generated fields
  clientId: {
    type: String,
    unique: true,
    sparse: true
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'active', 'inactive'],
    default: 'draft'
  },
  createdBy: {
    type: String
  },
  lastModifiedBy: {
    type: String
  },
  
  // 1. Applicant Information
  applicant: {
    // Basic Info
    title: { type: String, enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] },
    firstName: { type: String, trim: true, maxlength: 50 },
    mi: { type: String, trim: true, maxlength: 1 },
    lastName: { type: String, trim: true, maxlength: 50 },
    suffix: { type: String, enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD'] },
    maidenName: { type: String, trim: true, maxlength: 50 },
    isConsultant: { type: Boolean, default: false },
    
    // Contact Info
    homePhone: { type: String, trim: true },
    workPhone: { type: String, trim: true },
    cellPhone: { type: String, trim: true },
    otherPhone: { type: String, trim: true },
    fax: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    
    // Current Address
    currentAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      county: { type: String, trim: true },
      howLongYears: { type: Number, min: 0 },
      howLongMonths: { type: Number, min: 0 }
    },
    
    // Previous Address (if less than 2 years at current)
    previousAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      howLongYears: { type: Number, min: 0 },
      howLongMonths: { type: Number, min: 0 }
    },
    
    // Current Employment Information
    employment: {
      employmentStatus: { type: String, enum: ['Employed', 'Full-time', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part-Time', 'Contract'] },
      isBusinessOwner: { type: Boolean, default: false },
      occupation: { type: String, trim: true },
      employerName: { type: String, trim: true },
      employerAddress: { type: String, trim: true },
      employerCity: { type: String, trim: true },
      employerState: { type: String, trim: true },
      employerZipCode: { type: String, trim: true },
      monthlyGrossSalary: { type: Number, min: 0 },
      startDate: { type: Date },
      endDate: { type: Date },
      supervisor: { type: String, trim: true },
      supervisorPhone: { type: String, trim: true },
      additionalIncome: { type: Number, min: 0 },
      source: { type: String, trim: true }
    },
    
    // Previous Employment
    previousEmployment: {
      employerName: { type: String, trim: true },
      employerAddress: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      occupation: { type: String, trim: true },
      fromDate: { type: Date },
      toDate: { type: Date }
    },
    
    // Demographics
    demographics: {
      birthPlace: { type: String, trim: true },
      dateOfBirth: { type: Date },
      ssn: { type: String, trim: true },
      race: { type: String, enum: ['American Indian', 'Asian', 'Black/African American', 'Hispanic/Latino', 'Native Hawaiian', 'White', 'Other', 'Decline to Answer'] },
      maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] },
      anniversary: { type: Date },
      spouseName: { type: String, trim: true },
      spouseOccupation: { type: String, trim: true },
      numberOfDependents: { type: Number, min: 0 }
    }
  },
  
  // 2. Co-Applicant Information
  coApplicant: {
    includeCoApplicant: { type: Boolean, default: false },
    title: { type: String, enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] },
    firstName: { type: String, trim: true, maxlength: 50 },
    mi: { type: String, trim: true, maxlength: 1 },
    lastName: { type: String, trim: true, maxlength: 50 },
    suffix: { type: String, enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD'] },
    maidenName: { type: String, trim: true, maxlength: 50 },
    isConsultant: { type: Boolean, default: false },
    
    // Contact Info
    homePhone: { type: String, trim: true },
    workPhone: { type: String, trim: true },
    cellPhone: { type: String, trim: true },
    otherPhone: { type: String, trim: true },
    fax: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    
    // Current Address
    currentAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      county: { type: String, trim: true },
      howLongYears: { type: Number, min: 0 },
      howLongMonths: { type: Number, min: 0 }
    },
    
    // Previous Address (if less than 2 years at current)
    previousAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      howLongYears: { type: Number, min: 0 },
      howLongMonths: { type: Number, min: 0 }
    },
    
    // Current Employment Information
    employment: {
      employmentStatus: { type: String, enum: ['Employed', 'Full-time', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part-Time', 'Contract'] },
      isBusinessOwner: { type: Boolean, default: false },
      occupation: { type: String, trim: true },
      employerName: { type: String, trim: true },
      employerAddress: { type: String, trim: true },
      employerCity: { type: String, trim: true },
      employerState: { type: String, trim: true },
      employerZipCode: { type: String, trim: true },
      monthlyGrossSalary: { type: Number, min: 0 },
      startDate: { type: Date },
      endDate: { type: Date },
      supervisor: { type: String, trim: true },
      supervisorPhone: { type: String, trim: true },
      additionalIncome: { type: Number, min: 0 },
      source: { type: String, trim: true }
    },
    
    // Previous Employment
    previousEmployment: {
      employerName: { type: String, trim: true },
      employerAddress: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      occupation: { type: String, trim: true },
      fromDate: { type: Date },
      toDate: { type: Date }
    },
    
    // Demographics
    demographics: {
      birthPlace: { type: String, trim: true },
      dateOfBirth: { type: Date },
      ssn: { type: String, trim: true },
      race: { type: String, enum: ['American Indian', 'Asian', 'Black/African American', 'Hispanic/Latino', 'Native Hawaiian', 'White', 'Other', 'Decline to Answer'] },
      maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] },
      anniversary: { type: Date },
      spouseName: { type: String, trim: true },
      spouseOccupation: { type: String, trim: true },
      numberOfDependents: { type: Number, min: 0 }
    }
  },
  
  // 3. Liabilities
  liabilities: [{
    debtorType: { type: String, enum: ['Applicant', 'Co-Applicant', 'Joint'] },
    liabilityType: { type: String, trim: true },
    creditorName: { type: String, trim: true },
    currentBalance: { type: Number, min: 0 },
    monthlyPayment: { type: Number, min: 0 },
    payOff: { type: Boolean, default: false },
    propertyAddress: { type: String, trim: true },
    propertyValue: { type: Number, min: 0 },
    grossRent: { type: Number, min: 0 },
    escrow: { type: String, trim: true },
    taxes: { type: Number, min: 0 },
    hoi: { type: Number, min: 0 },
    totalEscrow: { type: Number, min: 0 },
    netRent: { type: Number }
  }],
  
  // 4. Mortgages
  mortgages: [{
    propertyAddress: { type: String, trim: true },
    lender: { type: String, trim: true },
    originalAmount: { type: Number, min: 0 },
    currentBalance: { type: Number, min: 0 },
    monthlyPayment: { type: Number, min: 0 },
    interestRate: { type: Number, min: 0, max: 100 },
    loanType: { type: String, trim: true },
    propertyValue: { type: Number, min: 0 },
    rentalIncome: { type: Number, min: 0 }
  }],
  
  // 5. Underwriting
  underwriting: {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    clientId: { type: String, trim: true },
    creditScore: { type: Number, min: 300, max: 850 },
    annualIncome: { type: Number, min: 0 },
    monthlyIncome: { type: Number, min: 0 },
    debtToIncomeRatio: { type: Number, min: 0, max: 100 },
    assets: { type: Number, min: 0 },
    liabilities: { type: Number, min: 0 },
    netWorth: { type: Number },
    loanAmount: { type: Number, min: 0 },
    loanToValueRatio: { type: Number, min: 0, max: 100 },
    propertyValue: { type: Number, min: 0 },
    downPayment: { type: Number, min: 0 },
    cashReserves: { type: Number, min: 0 },
    employmentHistory: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  
  // 6. Loan Status
  loanStatus: {
    applicationDate: { type: Date },
    status: { type: String, enum: ['Pre-Approval', 'Application Submitted', 'Under Review', 'Approved', 'Denied', 'Funded'] },
    loanType: { type: String, enum: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'] },
    loanAmount: { type: Number, min: 0 },
    interestRate: { type: Number, min: 0, max: 100 },
    term: { type: Number, min: 1, max: 50 },
    closingDate: { type: Date },
    lender: { type: String, trim: true },
    loanOfficer: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  
  // 7. Drivers
  drivers: [{
    fullName: { type: String, trim: true },
    dateOfBirth: { type: Date },
    age: { type: Number, min: 0, max: 150 },
    relationship: { type: String, trim: true },
    ssn: { type: String, trim: true },
    sex: { type: String, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] },
    drivingStatus: { type: String, enum: ['Licensed', 'Permit', 'No License', 'Suspended'] },
    licenseNumber: { type: String, trim: true },
    licenseState: { type: String, trim: true },
    accidentsViolations: { type: Boolean, default: false },
    explanation: { type: String, trim: true }
  }],
  
  // 8. Vehicle Coverage
  vehicleCoverage: {
    hasVehicles: { type: Boolean, default: false },
    currentProvider: { type: String, trim: true },
    policyNumber: { type: String, trim: true },
    coverageLimits: {
      liability: { type: String, trim: true },
      collision: { type: String, trim: true },
      comprehensive: { type: String, trim: true },
      uninsuredMotorist: { type: String, trim: true }
    },
    vehicles: [{
      year: { type: Number, min: 1900, max: new Date().getFullYear() + 1 },
      make: { type: String, trim: true },
      model: { type: String, trim: true },
      vin: { type: String, trim: true },
      usage: { type: String, enum: ['Personal', 'Business', 'Farm'] },
      annualMileage: { type: Number, min: 0 },
      coverage: {
        liability: { type: Boolean, default: false },
        collision: { type: Boolean, default: false },
        comprehensive: { type: Boolean, default: false }
      }
    }]
  },
  
  // 9. Homeowners Insurance
  homeowners: {
    hasHomeInsurance: { type: Boolean, default: false },
    provider: { type: String, trim: true },
    policyNumber: { type: String, trim: true },
    coverageAmount: { type: Number, min: 0 },
    deductible: { type: Number, min: 0 },
    annualPremium: { type: Number, min: 0 },
    propertyValue: { type: Number, min: 0 },
    mortgageCompany: { type: String, trim: true },
    additionalCoverage: [{
      type: { type: String, trim: true },
      amount: { type: Number, min: 0 }
    }]
  },
  
  // 10. Renters Insurance
  renters: {
    hasRentersInsurance: { type: Boolean, default: false },
    provider: { type: String, trim: true },
    policyNumber: { type: String, trim: true },
    coverageAmount: { type: Number, min: 0 },
    deductible: { type: Number, min: 0 },
    annualPremium: { type: Number, min: 0 },
    personalProperty: { type: Number, min: 0 },
    liability: { type: Number, min: 0 },
    additionalLiving: { type: Number, min: 0 }
  },
  
  // 11. Income Protection
  incomeProtection: {
    hasIncomeProtection: { type: Boolean, default: false },
    shortTermDisability: {
      provider: { type: String, trim: true },
      policyNumber: { type: String, trim: true },
      monthlyBenefit: { type: Number, min: 0 },
      eliminationPeriod: { type: Number, min: 0 },
      benefitPeriod: { type: Number, min: 0 }
    },
    longTermDisability: {
      provider: { type: String, trim: true },
      policyNumber: { type: String, trim: true },
      monthlyBenefit: { type: Number, min: 0 },
      eliminationPeriod: { type: Number, min: 0 },
      benefitPeriod: { type: String, trim: true }
    },
    lifeInsurance: [{
      provider: { type: String, trim: true },
      policyNumber: { type: String, trim: true },
      faceAmount: { type: Number, min: 0 },
      premiumAmount: { type: Number, min: 0 },
      premiumFrequency: { type: String, enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'] },
      beneficiaries: [{
        name: { type: String, trim: true },
        relationship: { type: String, trim: true },
        percentage: { type: Number, min: 0, max: 100 }
      }]
    }]
  },
  
  // 12. Retirement
  retirement: {
    hasRetirementAccounts: { type: Boolean, default: false },
    currentAge: { type: Number, min: 0, max: 150 },
    desiredRetirementAge: { type: Number, min: 50, max: 100 },
    estimatedRetirementIncome: { type: Number, min: 0 },
    currentRetirementSavings: { type: Number, min: 0 },
    monthlyContribution: { type: Number, min: 0 },
    employerMatch: { type: Number, min: 0 },
    retirementAccounts: [{
      accountType: { type: String, enum: ['401k', '403b', 'IRA', 'Roth IRA', 'Pension', 'Other'] },
      provider: { type: String, trim: true },
      currentBalance: { type: Number, min: 0 },
      monthlyContribution: { type: Number, min: 0 },
      employerMatch: { type: Number, min: 0 },
      vestingSchedule: { type: String, trim: true }
    }],
    retirementGoals: {
      monthlyIncomeNeeded: { type: Number, min: 0 },
      inflationRate: { type: Number, min: 0, max: 20 },
      rateOfReturn: { type: Number, min: 0, max: 50 },
      retirementDuration: { type: Number, min: 1, max: 100 }
    }
  },
  
  // 13. Lineage (Referral/Source Tracking)
  lineage: {
    referralSource: { type: String, enum: ['Website', 'Referral', 'Advertisement', 'Social Media', 'Other'] },
    referredBy: { type: String, trim: true },
    referrerContact: { type: String, trim: true },
    originalContactDate: { type: Date },
    leadSource: { type: String, trim: true },
    marketingCampaign: { type: String, trim: true },
    notes: { type: String, trim: true },
    consultantAssigned: { type: Schema.Types.ObjectId, ref: 'Consultant' },
    consultantNotes: { type: String, trim: true }
  },
  
  // Legacy flat structure for backward compatibility
  // firstName?: string;
  // lastName?: string;
  // email?: string;  
  // phone?: string;
  // address?: {
  //   street?: string;
  //   city?: string;
  //   state?: string;
  //   zipCode?: string;
  //   country?: string;
  // };
  // dateOfBirth?: Date;
  // ssn?: string;
  // consultantId?: mongoose.Types.ObjectId;
  // financialInfo?: {
  //   annualIncome?: number;
  //   netWorth?: number;
  //   investmentGoals?: string;
  //   riskTolerance?: 'low' | 'medium' | 'high';
  // };
  // createdAt?: Date;
  // updatedAt?: Date;
}, {
  timestamps: true,
  collection: 'securia_clients'
});

// Encryption methods
SecuriaClientSchema.methods.encryptSSN = function(ssn: string): string {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(ssn, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('SSN encryption error:', error);
    return ssn; // Return original if encryption fails
  }
};

SecuriaClientSchema.methods.decryptSSN = function(): string {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    
    const parts = this.ssn.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('SSN decryption error:', error);
    return this.ssn; // Return encrypted if decryption fails
  }
};

// Create indexes
SecuriaClientSchema.index({ email: 1 });
SecuriaClientSchema.index({ consultantId: 1 });
SecuriaClientSchema.index({ status: 1 });
SecuriaClientSchema.index({ firstName: 1, lastName: 1 });
SecuriaClientSchema.index({ 'financialInfo.riskTolerance': 1 });
SecuriaClientSchema.index({ clientId: 1 });

// Pre-save hook to auto-generate clientId
SecuriaClientSchema.pre('save', async function(next) {
  if (this.isNew && !this.clientId) {
    try {
      // Find the highest clientId number
      const lastClient = await mongoose.model('SecuriaClient').findOne(
        { clientId: { $regex: /^CLI\d+$/ } },
        {},
        { sort: { clientId: -1 } }
      );
      
      let nextNumber = 1;
      if (lastClient && lastClient.clientId) {
        const lastNumber = parseInt(lastClient.clientId.replace('CLI', ''));
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
      
      this.clientId = `CLI${String(nextNumber).padStart(6, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

export default mongoose.model<ISecuriaClient>('SecuriaClient', SecuriaClientSchema);
