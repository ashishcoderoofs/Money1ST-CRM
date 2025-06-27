
import { Tables } from "@/integrations/supabase/types";

export interface HouseholdMember {
  first_name: string;
  mi: string;
  last_name: string;
  date_of_birth: string;
  age: string;
  ssn: string;
  relationship: string;
  // New fields for enhanced household management
  sex?: string;
  monthly_income?: string;
  tobacco_user?: string;
  student?: string;
}

export interface Liability {
  id?: string;
  debtor_type: string;
  liability_type?: string;
  creditor_name?: string;
  current_balance?: number;
  monthly_payment?: number;
  pay_off?: boolean;
  property_address?: string;
  property_value?: number;
  gross_rent?: number;
  escrow?: string;
  taxes?: number;
  hoi?: number;
}

export type ClientFormValues = {
  applicant: string;
  co_applicant?: string;
  consultant_name?: string;
  processor_name?: string;
  total_debt: number;
  payoff_amount?: number;
  status: "Open" | "Closed";
  entry_date: string;
  // Contact fields
  applicant_contact?: string;
  applicant_email?: string;
  coapplicant_contact?: string;
  coapplicant_email?: string;
  co_applicant_total_debt?: number;
  // Name breakdown fields
  applicant_title?: string;
  applicant_first_name?: string;
  applicant_mi?: string;
  applicant_last_name?: string;
  applicant_suffix?: string;
  applicant_maiden_name?: string;
  applicant_is_consultant?: boolean;
  // Address fields
  applicant_address?: string;
  applicant_city?: string;
  applicant_county?: string;
  applicant_state?: string;
  applicant_zip_code?: string;
  applicant_time_at_address?: string;
  applicant_previous_address?: string;
  applicant_previous_address_time?: string;
  // Contact fields
  applicant_home_phone?: string;
  applicant_other_phone?: string;
  applicant_fax?: string;
  // Employment fields
  applicant_employment_status?: string;
  applicant_business_owner?: string;
  applicant_employer_name?: string;
  applicant_employer_address?: string;
  applicant_employer_city?: string;
  applicant_employer_state?: string;
  applicant_employer_zip?: string;
  applicant_occupation?: string;
  applicant_monthly_salary?: number;
  applicant_employer_phone?: string;
  applicant_start_date?: string;
  applicant_end_date?: string;
  applicant_additional_income?: number;
  applicant_additional_income_source?: string;
  applicant_previous_employer?: string;
  applicant_previous_employer_address?: string;
  applicant_previous_occupation?: string;
  applicant_previous_employment_from?: string;
  applicant_previous_employment_to?: string;
  applicant_supervisor?: string;
  // Demographics
  applicant_dob?: string;
  applicant_ssn?: string;
  applicant_birth_place?: string;
  applicant_race?: string;
  applicant_marital_status?: string;
  applicant_anniversary?: string;
  applicant_spouse_name?: string;
  applicant_spouse_occupation?: string;
  applicant_dependents_count?: number;
  // Co-applicant fields
  coapplicant_title?: string;
  coapplicant_first_name?: string;
  coapplicant_mi?: string;
  coapplicant_last_name?: string;
  coapplicant_suffix?: string;
  coapplicant_maiden_name?: string;
  coapplicant_is_consultant?: boolean;
  coapplicant_address?: string;
  coapplicant_city?: string;
  coapplicant_county?: string;
  coapplicant_state?: string;
  coapplicant_zip_code?: string;
  coapplicant_time_at_address?: string;
  coapplicant_previous_address?: string;
  coapplicant_previous_address_time?: string;
  coapplicant_home_phone?: string;
  coapplicant_other_phone?: string;
  coapplicant_fax?: string;
  coapplicant_employment_status?: string;
  coapplicant_business_owner?: string;
  coapplicant_employer_name?: string;
  coapplicant_employer_address?: string;
  coapplicant_employer_city?: string;
  coapplicant_employer_state?: string;
  coapplicant_employer_zip?: string;
  coapplicant_occupation?: string;
  coapplicant_monthly_salary?: number;
  coapplicant_employer_phone?: string;
  coapplicant_start_date?: string;
  coapplicant_end_date?: string;
  coapplicant_additional_income?: number;
  coapplicant_additional_income_source?: string;
  coapplicant_previous_employer?: string;
  coapplicant_previous_employer_address?: string;
  coapplicant_previous_occupation?: string;
  coapplicant_previous_employment_from?: string;
  coapplicant_previous_employment_to?: string;
  coapplicant_dob?: string;
  coapplicant_ssn?: string;
  coapplicant_birth_place?: string;
  coapplicant_race?: string;
  coapplicant_marital_status?: string;
  coapplicant_anniversary?: string;
  coapplicant_spouse_name?: string;
  coapplicant_spouse_occupation?: string;
  coapplicant_dependents_count?: number;
  // Household members
  household_members?: HouseholdMember[];
  // Co-applicant household members
  coapplicant_household_members?: HouseholdMember[];
  // Liabilities
  liabilities?: Liability[];
  // Underwriting fields
  underwriting_address?: string;
  underwriting_city?: string;
  underwriting_state?: string;
  underwriting_client_id?: string;
  underwriting_credit_scores?: any;
  underwriting_cnh_option?: string;
  underwriting_tud_option?: string;
  underwriting_terms?: string;
  underwriting_programs?: string;
  underwriting_notes?: string;
};

export type Client = Tables<"clients">;
