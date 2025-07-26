// MongoDB Client types for Money1ST CRM
// Updated to match backend normalized structure and field names

import type { Title, Suffix } from '../constants';

// Core Client Interface - matches backend exactly
export interface Client {
  _id?: string;
  client_id?: string; // Optional since it's auto-generated
  entry_date: string;
  status: 'Active' | 'Pending' | 'Inactive';
  payoff_amount: number;
  consultant_name: string;
  processor_name: string;
  
  // References to related documents (populated)
  applicant?: Applicant;
  co_applicant?: CoApplicant | null;
  liabilities?: Liability[];
  mortgages?: Mortgage[];
  underwriting?: Underwriting | null;
  chm?: CHM | null;
  tud?: TUD | null;
  loan_details?: LoanDetails | null;
  loan_options?: LoanOptions | null;
  drivers?: Driver[];
  
  // Metadata
  loanStatus?: any;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Applicant Interface - matches backend Applicant model
export interface Applicant {
  _id?: string;
  name_information: {
    title?: Title;
    first_name: string;
    middle_initial?: string;
    last_name: string;
    suffix?: Suffix;
    maiden_name?: string;
    is_consultant?: boolean;
  };
  contact: {
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
  };
  demographics_information: {
    date_of_birth?: string;
    birth_place?: string;
    marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
    race?: 'American Indian or Alaska Native' | 'Asian' | 'Black or African American' | 'Hispanic or Latino' | 'Native Hawaiian or Other Pacific Islander' | 'White' | 'Two or More Races' | 'Other';
    anniversary?: string;
    spouse_name?: string;
    spouse_occupation?: string;
    number_of_dependents?: string;
  };
  current_address?: {
    months?: string;
    years?: string;
    how_long_at_current_address?: string;
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
    status?: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student' | 'Part time' | 'Contract';
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
  household_members?: HouseholdMember[];
  credit_scores?: {
    equifax?: string;
    experian?: string;
    transunion?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// CoApplicant Interface - extends Applicant with co-applicant specific fields
export interface CoApplicant extends Applicant {
  include_coapplicant: boolean;
}

// Household Member Interface
export interface HouseholdMember {
  _id?: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  relationship: string;
  ssn: string;
  sex: string;
  maritalStatus: string;
  drivingStatus: string;
  licenseNumber?: string;
  state: string;
  accidentsViolations: string;
}

// Driver Interface - matches backend Driver model
export interface Driver {
  _id?: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  relationship: string;
  ssn: string;
  sex: string;
  maritalStatus: string;
  drivingStatus: string;
  licenseNumber?: string;
  state: string;
  accidentsViolations: string;
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Liability Interface - matches backend Liability model
export interface Liability {
  _id?: string;
  creditor_name: string;
  account_number?: string;
  current_balance: number;
  monthly_payment: number;
  account_type: string;
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mortgage Interface - matches backend Mortgage model
export interface Mortgage {
  _id?: string;
  lender_name: string;
  loan_amount: number;
  loan_type: string;
  interest_rate: number;
  term: number;
  monthly_payment: number;
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Underwriting Interface - matches backend Underwriting model
export interface Underwriting {
  _id?: string;
  status: string;
  notes?: string;
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CHM Interface - matches backend CHM model
export interface CHM {
  _id?: string;
  // Add CHM specific fields
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// TUD Interface - matches backend TUD model
export interface TUD {
  _id?: string;
  // Add TUD specific fields
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// LoanDetails Interface - matches backend LoanDetails model
export interface LoanDetails {
  _id?: string;
  // Add LoanDetails specific fields
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// LoanOptions Interface - matches backend LoanOptions model
export interface LoanOptions {
  _id?: string;
  // Add LoanOptions specific fields
  client_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
export interface ClientsResponse {
  success: boolean;
  data: Client[];
  pagination?: {
    page: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ClientResponse {
  success: boolean;
  data: Client;
}

// Form Data Types for Frontend
export interface ClientFormData {
  // Core client fields
  entry_date: string;
  status: 'Active' | 'Pending' | 'Inactive';
  payoff_amount: number;
  consultant_name: string;
  processor_name: string;
  
  // Related data
  applicant?: Partial<Applicant>;
  co_applicant?: Partial<CoApplicant>;
  liabilities?: Partial<Liability>[];
  mortgages?: Partial<Mortgage>[];
  underwriting?: Partial<Underwriting>;
  drivers?: Partial<Driver>[];
  
  // Metadata
  loanStatus?: any;
}

// Legacy support - for backward compatibility during transition
export interface LegacyClient extends Client {
  // Add any legacy fields that might still be used
  [key: string]: any;
}
