import { Schema, model, Types, Document } from 'mongoose';

export type ApplicantTitle = 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.';
export type ApplicantSuffix = 'Jr.' | 'Sr.' | 'II' | 'III' | 'IV' | 'V' | 'MD' | 'PhD';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
export type Race = 'White' | 'Black' | 'Asian' | 'Hispanic' | 'Other';
export type EmploymentStatus = 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student';
export type ClientStatus = 'Active' | 'Pending' | 'Inactive';



export interface IApplicant extends Document {
  name_information: {
    title?: ApplicantTitle;
    first_name: string;
    middle_initial?: string;
    last_name: string;
    suffix?: ApplicantSuffix;
    maiden_name?: string;
    is_consultant?: boolean;
  };
  current_address?: {
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
  previous_address?: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    months?: string;
    years?: string;
    duration?: string;
  };
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
    other_income?: string;
    start_date?: string;
    end_date?: string;
    supervisor?: string;
    supervisor_phone?: string;
    source?: string;
  };
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
  client_id: string;
  entry_date: Date;
  payoff_amount: number;
  notes?: string;
  created_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}



const NameInformationSchema = new Schema({
  title: { type: String, enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] },
  first_name: { type: String, required: true },
  middle_initial: { type: String },
  last_name: { type: String, required: true },
  suffix: { type: String, enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD'] },
  maiden_name: { type: String },
  is_consultant: { type: Boolean }
}, { _id: false });

const DemographicsInformationSchema = new Schema({
  birth_place: { type: String },
  dob: { type: Date },
  marital_status: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] },
  race: { type: String, enum: ['White', 'Black', 'Asian', 'Hispanic', 'Other'] },
  anniversary: { type: String },
  spouse_name: { type: String },
  spouse_occupation: { type: String },
  number_of_dependents: { type: String }
}, { _id: false });

const HouseholdMemberSchema = new Schema({
  first_name: { type: String },
  middle_initial: { type: String },
  last_name: { type: String },
  relationship: { type: String },
  dob: { type: String },
  age: { type: String },
  sex: { type: String },
  marital_status: { type: String },
  ssn: { type: String }
}, { _id: false });

const CurrentEmploymentSchema = new Schema({
  status: { type: String, enum: ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student'] },
  is_business_owner: { type: String },
  employer_name: { type: String },
  employer_address: { type: String },
  employer_city: { type: String },
  employer_state: { type: String },
  employer_zip_code: { type: String },
  occupation: { type: String },
  monthly_salary: { type: String },
  other_income: { type: String },
  start_date: { type: String },
  end_date: { type: String },
  supervisor: { type: String },
  supervisor_phone: { type: String },
  source: { type: String }
}, { _id: false });

const ApplicantSchema = new Schema<IApplicant>({
  name_information: NameInformationSchema,
  current_address: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip_code: { type: String },
    county: { type: String },
    home_phone: { type: String },
    work_phone: { type: String },
    cell_phone: { type: String },
    other_phone: { type: String },
    email: { type: String },
    months: { type: String },
    years: { type: String },
    how_long_at_current_address: { type: String },
    fax: { type: String }
  },
  previous_address: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip_code: { type: String },
    months: { type: String },
    years: { type: String },
    duration: { type: String }
  },
  current_employment: CurrentEmploymentSchema,
  previous_employment: {
    employer_name: { type: String },
    employer_address: { type: String },
    employer_city: { type: String },
    employer_state: { type: String },
    employer_zip_code: { type: String },
    from_date: { type: String },
    to_date: { type: String },
    occupation: { type: String }
  },
  demographics_information: DemographicsInformationSchema,
  household_members: [HouseholdMemberSchema],
  client_id: { type: String, index: true },
  entry_date: { type: Date, default: Date.now },
  payoff_amount: { type: Number },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default model<IApplicant>('Applicant', ApplicantSchema);
