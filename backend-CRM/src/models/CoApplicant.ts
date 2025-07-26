import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICoApplicant extends Document {
  _id: Types.ObjectId;
  
  // Co-applicant specific flag
  include_coapplicant: boolean;
  
  // Name Information
  name_information: {
    title?: string;
    first_name: string;
    middle_initial?: string;
    last_name: string;
    suffix?: string;
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
    years?: number;
    months?: number;
    how_long_at_current_address?: string;
    fax?: string;
  };
  
  // Previous Address
  previous_address?: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    months?: number;
    years?: number;
    duration?: string;
  };
  
  // Employment Information
  employment: {
    status?: string;
    is_business_owner?: string;
    employer_name?: string;
    employer_address?: string;
    employer_city?: string;
    employer_state?: string;
    employer_zip_code?: string;
    occupation?: string;
    monthly_salary?: string;
    gross_monthly_salary?: string;
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
  
  // Credit Scores
  credit_scores?: {
    equifax?: string;
    experian?: string;
    transunion?: string;
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
  
  // Demographics Information
  demographics_information: {
    dob: string;
    birth_place?: string;
    marital_status?: string;
    race?: string;
    anniversary?: string;
    spouse_name?: string;
    spouse_occupation?: string;
    number_of_dependents?: string;
  };
  
  // Additional co-applicant fields
  fax?: string;
  contact?: {
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
    years?: number;
    months?: number;
    how_long_at_current_address?: string;
    fax?: string;
  };
  
  // Metadata
  entry_date: Date;
  payoff_amount?: number;
  notes?: string;
  created_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schemas (reusing from Applicant structure)
const NameInformationSchema = new Schema({
  title: { type: String, enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] },
  first_name: { type: String, required: true },
  middle_initial: { type: String, maxlength: 1 },
  last_name: { type: String, required: true },
  suffix: { type: String, enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD'] },
  maiden_name: { type: String },
  is_consultant: { type: Boolean, default: false }
}, { _id: false });

const AddressSchema = new Schema({
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
  years: { type: Number, min: 0 },
  months: { type: Number, min: 0, max: 11 },
  how_long_at_current_address: { type: String },
  fax: { type: String }
}, { _id: false });

const PreviousAddressSchema = new Schema({
  address: { type: String, maxlength: 200 },
  city: { type: String, maxlength: 100 },
  state: { type: String, maxlength: 2 },
  zip_code: { type: String, maxlength: 10 },
  months: { type: Number, min: 0, max: 11 },
  years: { type: Number, min: 0 },
  duration: { type: String }
}, { _id: false });

const EmploymentSchema = new Schema({
  status: { type: String, enum: ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part time', 'Contract'] },
  is_business_owner: { type: String },
  employer_name: { type: String },
  employer_address: { type: String },
  employer_city: { type: String },
  employer_state: { type: String, maxlength: 2 },
  employer_zip_code: { type: String, maxlength: 10 },
  occupation: { type: String },
  monthly_salary: { type: String },
  gross_monthly_salary: { type: String },
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

const CreditScoresSchema = new Schema({
  equifax: { type: String },
  experian: { type: String },
  transunion: { type: String }
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

const DemographicsInformationSchema = new Schema({
  dob: { type: String, required: true },
  birth_place: { type: String },
  marital_status: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] },
  race: { type: String, enum: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races', 'Other'] },
  anniversary: { type: String },
  spouse_name: { type: String },
  spouse_occupation: { type: String },
  number_of_dependents: { type: String }
}, { _id: false });

// Main CoApplicant Schema
const CoApplicantSchema = new Schema<ICoApplicant>({
  include_coapplicant: { type: Boolean, default: false, required: true },
  name_information: { type: NameInformationSchema, required: true },
  current_address: { type: AddressSchema },
  previous_address: { type: PreviousAddressSchema },
  employment: { type: EmploymentSchema },
  previous_employment: { type: PreviousEmploymentSchema },
  credit_scores: { type: CreditScoresSchema },
  household_members: [{ type: HouseholdMemberSchema }],
  demographics_information: { type: DemographicsInformationSchema, required: true },
  fax: { type: String },
  contact: { type: AddressSchema },
  entry_date: { type: Date, default: Date.now },
  payoff_amount: { type: Number, default: 0 },
  notes: { type: String },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<ICoApplicant>('CoApplicant', CoApplicantSchema);
