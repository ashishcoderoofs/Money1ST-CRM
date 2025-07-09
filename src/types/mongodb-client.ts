// MongoDB Client types for Money1ST CRM
// Updated to match backend normalized structure and field names

import type { Title, Suffix } from '../constants';

export interface Applicant {
  title?: Title;
  first_name: string;
  middle_initial?: string;
  last_name: string;
  suffix?: Suffix;
  maiden_name?: string;
  is_consultant?: boolean;
  date_of_birth?: string;
  marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
  race?: 'White' | 'Black' | 'Asian' | 'Hispanic' | 'Other';
  birth_place?: string;
  anniversary?: string;
  spouse_name?: string;
  spouse_occupation?: string;
  number_of_dependents?: string;
  fax?: string;
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
  employment?: {
    status?: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student';
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
  credit_scores?: {
    equifax?: string;
    experian?: string;
    transunion?: string;
  };
  created_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CoApplicant extends Applicant {
  include_co_applicant?: boolean;
}

export interface HouseholdMember {
  name?: string;
  dob?: string;
  relationship?: string;
  age?: string;
}

export interface Client {
  _id?: string;
  client_id: string;
  entry_date: string;
  status: 'Active' | 'Pending' | 'Inactive';
  payoff_amount: number;
  consultant_name: string;
  processor_name: string;
  applicant?: Applicant;
  co_applicant?: CoApplicant;
  household_members?: HouseholdMember[];
  // ...add other normalized fields as needed
}
