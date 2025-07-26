import { Schema, model, Types, Document } from 'mongoose';

export type ApplicantTitle = 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.';
export type ApplicantSuffix = 'Jr.' | 'Sr.' | 'II' | 'III' | 'IV' | 'V' | 'MD' | 'PhD';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
export type Race = 'American Indian or Alaska Native' | 'Asian' | 'Black or African American' | 'Hispanic or Latino' | 'Native Hawaiian or Other Pacific Islander' | 'White' | 'Two or More Races' | 'Other';
export type EmploymentStatus = 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student' | 'Part time' | 'Contract';

export interface IApplicant extends Document {
  _id: Types.ObjectId;
  
  // Name Information
  name_information: {
    title?: ApplicantTitle;
    first_name: string;
    middle_initial?: string;
    last_name: string;
    suffix?: ApplicantSuffix;
    maiden_name?: string;
    is_consultant?: boolean;
  };
  
  // Contact Information
  current_address: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    county?: string;
    home_phone?: string;
    work_phone?: string;
    cell_phone?: string;
    other_phone?: string;
    email?: string;
    months?: string;
    years?: string;
    how_long_at_current_address?: string;
    fax?: string;
  };
  
  // Previous Address
  previous_address?: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    months?: string;
    years?: string;
    duration?: string;
  };
  
  // Employment Information
  current_employment?: {
    status?: EmploymentStatus;
    is_business_owner?: string;
    employer_name?: string;
    employer_address?: string;
    employer_city?: string;
    employer_state?: string;
    employer_zip_code?: string;
    occupation?: string;
    monthly_salary?: string;
    additional_income?: string;
    start_date?: string;
    end_date?: string;
    supervisor?: string;
    supervisor_phone?: string;
    source?: string;
  };
  
  // Previous Employment
  previous_employment?: {
    employer_name?: string;
    employer_address?: string;
    employer_city?: string;
    employer_state?: string;
    employer_zip_code?: string;
    from_date?: string;
    to_date?: string;
    occupation?: string;
  };
  
  // Demographics Information
  demographics_information: {
    birth_place?: string;
    dob: Date;
    marital_status?: MaritalStatus;
    race?: Race;
    anniversary?: string;
    spouse_name?: string;
    spouse_occupation?: string;
    number_of_dependents?: string;
  };
  
  // Household Members
  household_members: Array<{
    first_name: string;
    middle_initial?: string;
    last_name: string;
    relationship: string;
    dob: string;
    age: string;
    sex?: string;
    marital_status?: string;
    ssn?: string;
  }>;
  
  // Credit Scores
  credit_scores?: {
    equifax?: string;
    experian?: string;
    transunion?: string;
  };
  
  // Metadata
  notes?: string;
  created_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schemas
const NameInformationSchema = new Schema({
  title: { type: String, enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] },
  first_name: { type: String, required: true },
  middle_initial: { type: String, maxlength: 1 },
  last_name: { type: String, required: true },
  suffix: { type: String, enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD'] },
  maiden_name: { type: String },
  is_consultant: { type: Boolean, default: false }
}, { _id: false });

const CurrentAddressSchema = new Schema({
  address: { type: String, maxlength: 200 },
  city: { type: String, maxlength: 100 },
  state: { type: String, maxlength: 2 },
  zip_code: { type: String, maxlength: 10 },
  county: { type: String, maxlength: 100 },
  home_phone: { type: String },
  work_phone: { type: String },
  cell_phone: { type: String },
  other_phone: { type: String },
  email: { type: String, lowercase: true },
  months: { type: String },
  years: { type: String },
  how_long_at_current_address: { type: String },
  fax: { type: String }
}, { _id: false });

const PreviousAddressSchema = new Schema({
  address: { type: String, maxlength: 200 },
  city: { type: String, maxlength: 100 },
  state: { type: String, maxlength: 2 },
  zip_code: { type: String, maxlength: 10 },
  months: { type: String },
  years: { type: String },
  duration: { type: String }
}, { _id: false });

const CurrentEmploymentSchema = new Schema({
  status: { type: String, enum: ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part time', 'Contract'] },
  is_business_owner: { type: String },
  employer_name: { type: String },
  employer_address: { type: String },
  employer_city: { type: String },
  employer_state: { type: String, maxlength: 2 },
  employer_zip_code: { type: String, maxlength: 10 },
  occupation: { type: String },
  monthly_salary: { type: String },
  additional_income: { type: String },
  start_date: { type: String },
  end_date: { type: String },
  supervisor: { type: String },
  supervisor_phone: { type: String },
  source: { type: String }
}, { _id: false });

const PreviousEmploymentSchema = new Schema({
  employer_name: { type: String },
  employer_address: { type: String },
  employer_city: { type: String },
  employer_state: { type: String, maxlength: 2 },
  employer_zip_code: { type: String, maxlength: 10 },
  from_date: { type: String },
  to_date: { type: String },
  occupation: { type: String }
}, { _id: false });

const DemographicsInformationSchema = new Schema({
  birth_place: { type: String },
  dob: { type: Date, required: true },
  marital_status: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] },
  race: { type: String, enum: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races', 'Other'] },
  anniversary: { type: String },
  spouse_name: { type: String },
  spouse_occupation: { type: String },
  number_of_dependents: { type: String }
}, { _id: false });

const HouseholdMemberSchema = new Schema({
  first_name: { type: String, required: true },
  middle_initial: { type: String, maxlength: 1 },
  last_name: { type: String, required: true },
  relationship: { type: String, required: true },
  dob: { type: String },
  age: { type: String },
  sex: { type: String },
  marital_status: { type: String },
  ssn: { type: String }
}, { _id: false });

const CreditScoresSchema = new Schema({
  equifax: { type: String },
  experian: { type: String },
  transunion: { type: String }
}, { _id: false });

// Main Applicant Schema
const ApplicantSchema = new Schema<IApplicant>({
  name_information: { type: NameInformationSchema, required: true },
  current_address: { type: CurrentAddressSchema },
  previous_address: { type: PreviousAddressSchema },
  current_employment: { type: CurrentEmploymentSchema },
  previous_employment: { type: PreviousEmploymentSchema },
  demographics_information: { type: DemographicsInformationSchema, required: true },
  household_members: [{ type: HouseholdMemberSchema }],
  credit_scores: { type: CreditScoresSchema },
  notes: { type: String },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default model<IApplicant>('Applicant', ApplicantSchema);
