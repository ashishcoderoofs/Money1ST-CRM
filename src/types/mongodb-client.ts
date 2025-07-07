// MongoDB Client types for Money1ST CRM
// These types match the actual data structure returned from the MongoDB backend

export interface MongoClient {
  // Allow any additional fields from MongoDB
  [key: string]: any;
  
  // Core client fields
  id?: string;
  _id?: string;
  applicant?: string;
  co_applicant?: string;
  consultant_name?: string;
  processor_name?: string;
  total_debt?: number;
  payoff_amount?: number;
  status?: string;
  entry_date?: string;
  
  // Applicant fields
  applicant_title?: string;
  applicant_first_name?: string;
  applicant_mi?: string;
  applicant_last_name?: string;
  applicant_suffix?: string;
  applicant_maiden_name?: string;
  applicant_is_consultant?: boolean;
  applicant_address?: string;
  applicant_city?: string;
  applicant_county?: string;
  applicant_state?: string;
  applicant_zip_code?: string;
  applicant_time_at_address?: string;
  applicant_previous_address?: string;
  applicant_previous_address_time?: string;
  applicant_home_phone?: string;
  applicant_work_phone?: string;
  applicant_cell_phone?: string;
  applicant_other_phone?: string;
  applicant_fax?: string;
  applicant_email?: string;
  applicant_contact?: string;
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
  coapplicant_work_phone?: string;
  coapplicant_cell_phone?: string;
  coapplicant_other_phone?: string;
  coapplicant_fax?: string;
  coapplicant_email?: string;
  coapplicant_contact?: string;
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
  
  // Vehicle Coverage fields
  vehicle_carrier?: string;
  vehicle_6_month_premium?: number;
  vehicle_expiration_date?: string;
  vehicle_annual_premium?: number;
  vehicle_6_month_premium_proposed?: number;
  vehicle_savings?: number;
  vehicle_app_date?: string;
  vehicle_status?: string;
  vehicle_status_date?: string;
  vehicle_issue_date?: string;
  vehicle_disburse_date?: string;
  vehicle_dft?: string;
  vehicle_dft_number?: string;
  vehicle_units?: boolean;
  
  // Homeowners fields
  homeowners_address?: string;
  homeowners_city?: string;
  homeowners_state?: string;
  homeowners_property_value?: number;
  homeowners_year_built?: number;
  homeowners_square_footage?: number;
  homeowners_construction?: string;
  homeowners_roof?: string;
  homeowners_foundation?: string;
  homeowners_current_provider?: string;
  homeowners_current_premium?: number;
  homeowners_proposed_premium?: number;
  homeowners_savings?: number;
  homeowners_current_deductible?: string;
  homeowners_proposed_deductible?: string;
  homeowners_smoke_detector?: string;
  homeowners_fire_extinguisher?: string;
  homeowners_monitored_burglar_alarm?: string;
  homeowners_monitored_fire_alarm?: string;
  homeowners_deadbolt_locks?: string;
  homeowners_24_hour_security_guard?: string;

  // Other fields
  co_applicant_total_debt?: number;
  household_members_json?: any;
  coapplicant_household_members_json?: any;
  household_members?: any[];
  coapplicant_household_members?: any[];
  liabilities?: any[];
}

// Export for convenience
export type Client = MongoClient;
