import mongoose, { Document, Schema, Types } from 'mongoose';

// Co-Applicant Interface
export interface ICoApplicant extends Document {
  // Auto-generated fields
  _id: Types.ObjectId;
  clientId: string; // Foreign key linking to the same client case as Applicant
  applicantId: Types.ObjectId; // Reference to the primary applicant
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
  
  // Basic Info - Required when co-applicant is provided
  title?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.';
  firstName?: string; // Required when co-applicant is included
  mi?: string;
  lastName?: string; // Required when co-applicant is included
  suffix?: 'Jr.' | 'Sr.' | 'II' | 'III' | 'IV' | 'V' | 'MD' | 'PhD';
  maidenName?: string;
  isConsultant?: boolean;
  
  // Contact Info - Required when co-applicant is provided
  homePhone?: string;
  workPhone?: string;
  cellPhone?: string; // Required when co-applicant is included
  otherPhone?: string;
  fax?: string;
  email?: string; // Required when co-applicant is included
  
  // Current Address - Required when co-applicant is provided
  currentAddress?: {
    street?: string; // Required when co-applicant is included
    city?: string; // Required when co-applicant is included
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
  
  // Employment Information
  employment?: {
    status?: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student';
    isBusinessOwner?: boolean;
    employerName?: string;
    employerAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    occupation?: string;
    monthlySalary?: number;
    employerPhone?: string;
    startDate?: Date;
    endDate?: Date;
    additionalIncome?: number;
    additionalIncomeSource?: string;
    supervisor?: string;
  };
  
  // Previous Employment
  previousEmployment?: {
    employerName?: string;
    employerAddress?: string;
    occupation?: string;
    fromDate?: Date;
    toDate?: Date;
  };
  
  // Demographics
  demographics?: {
    dateOfBirth?: Date;
    ssn?: string; // Encrypted
    birthPlace?: string;
    race?: string;
    maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
    anniversary?: Date;
    spouseName?: string;
    spouseOccupation?: string;
    numberOfDependents?: number;
  };
  
  // Household Members
  householdMembers?: Array<{
    firstName?: string;
    mi?: string;
    lastName?: string;
    dateOfBirth?: Date;
    age?: number;
    ssn?: string;
    relationship?: string;
    sex?: 'Male' | 'Female' | 'Other';
    monthlyIncome?: number;
    tobaccoUser?: boolean;
    student?: boolean;
  }>;
}

// Co-Applicant Schema
const CoApplicantSchema = new Schema<ICoApplicant>({
  clientId: { 
    type: String, 
    required: true,
    index: true 
  },
  applicantId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Applicant', 
    required: true,
    index: true 
  },
  createdBy: { type: String },
  lastModifiedBy: { type: String },
  
  // Basic Info
  title: { 
    type: String, 
    enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] 
  },
  firstName: { 
    type: String, 
    trim: true,
    maxlength: 50 
  },
  mi: { 
    type: String, 
    trim: true, 
    maxlength: 5 
  },
  lastName: { 
    type: String, 
    trim: true,
    maxlength: 50 
  },
  suffix: { 
    type: String, 
    enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD'] 
  },
  maidenName: { 
    type: String, 
    trim: true, 
    maxlength: 50 
  },
  isConsultant: { 
    type: Boolean, 
    default: false 
  },
  
  // Contact Info
  homePhone: { type: String, trim: true },
  workPhone: { type: String, trim: true },
  cellPhone: { 
    type: String, 
    trim: true 
  },
  otherPhone: { type: String, trim: true },
  fax: { type: String, trim: true },
  email: { 
    type: String, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // Current Address
  currentAddress: {
    street: { 
      type: String, 
      trim: true 
    },
    city: { 
      type: String, 
      trim: true 
    },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    county: { type: String, trim: true },
    howLongYears: { type: Number, min: 0 },
    howLongMonths: { type: Number, min: 0, max: 11 }
  },
  
  // Previous Address
  previousAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    howLongYears: { type: Number, min: 0 },
    howLongMonths: { type: Number, min: 0, max: 11 }
  },
  
  // Employment Information
  employment: {
    status: { 
      type: String, 
      enum: ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student'] 
    },
    isBusinessOwner: { type: Boolean },
    employerName: { type: String, trim: true },
    employerAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true }
    },
    occupation: { type: String, trim: true },
    monthlySalary: { type: Number, min: 0 },
    employerPhone: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    additionalIncome: { type: Number, min: 0 },
    additionalIncomeSource: { type: String, trim: true },
    supervisor: { type: String, trim: true }
  },
  
  // Previous Employment
  previousEmployment: {
    employerName: { type: String, trim: true },
    employerAddress: { type: String, trim: true },
    occupation: { type: String, trim: true },
    fromDate: { type: Date },
    toDate: { type: Date }
  },
  
  // Demographics
  demographics: {
    dateOfBirth: { type: Date },
    ssn: { type: String, trim: true }, // Will be encrypted
    birthPlace: { type: String, trim: true },
    race: { type: String, trim: true },
    maritalStatus: { 
      type: String, 
      enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] 
    },
    anniversary: { type: Date },
    spouseName: { type: String, trim: true },
    spouseOccupation: { type: String, trim: true },
    numberOfDependents: { type: Number, min: 0 }
  },
  
  // Household Members
  householdMembers: [{
    firstName: { type: String, trim: true },
    mi: { type: String, trim: true },
    lastName: { type: String, trim: true },
    dateOfBirth: { type: Date },
    age: { type: Number, min: 0 },
    ssn: { type: String, trim: true },
    relationship: { type: String, trim: true },
    sex: { type: String, enum: ['Male', 'Female', 'Other'] },
    monthlyIncome: { type: Number, min: 0 },
    tobaccoUser: { type: Boolean },
    student: { type: Boolean }
  }]
}, {
  timestamps: true,
  collection: 'coapplicants'
});

// Add indexes for better performance
CoApplicantSchema.index({ clientId: 1 });
CoApplicantSchema.index({ applicantId: 1 });
CoApplicantSchema.index({ email: 1 });
CoApplicantSchema.index({ createdAt: -1 });

// Compound index for efficient queries
CoApplicantSchema.index({ clientId: 1, applicantId: 1 });

export const CoApplicant = mongoose.model<ICoApplicant>('CoApplicant', CoApplicantSchema);
