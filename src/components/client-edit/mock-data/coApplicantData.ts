
import { Tables } from "@/integrations/supabase/types";

export const createCoApplicantData = (): Partial<Tables<"clients">> => ({
  // Contact fields
  coapplicant_contact: null,
  coapplicant_email: null,
  
  // Name breakdown fields
  coapplicant_title: null,
  coapplicant_first_name: null,
  coapplicant_mi: null,
  coapplicant_last_name: null,
  coapplicant_suffix: null,
  coapplicant_maiden_name: null,
  coapplicant_is_consultant: null,
  
  // Address fields
  coapplicant_address: null,
  coapplicant_city: null,
  coapplicant_county: null,
  coapplicant_state: null,
  coapplicant_zip_code: null,
  coapplicant_time_at_address: null,
  coapplicant_previous_address: null,
  coapplicant_previous_address_time: null,
  
  // Contact fields
  coapplicant_home_phone: null,
  coapplicant_other_phone: null,
  coapplicant_fax: null,
  
  // Employment fields
  coapplicant_employment_status: null,
  coapplicant_business_owner: null,
  coapplicant_employer_name: null,
  coapplicant_employer_address: null,
  coapplicant_employer_city: null,
  coapplicant_employer_state: null,
  coapplicant_employer_zip: null,
  coapplicant_occupation: null,
  coapplicant_monthly_salary: null,
  coapplicant_employer_phone: null,
  coapplicant_start_date: null,
  coapplicant_end_date: null,
  coapplicant_additional_income: null,
  coapplicant_additional_income_source: null,
  coapplicant_previous_employer: null,
  coapplicant_previous_employer_address: null,
  coapplicant_previous_occupation: null,
  coapplicant_previous_employment_from: null,
  coapplicant_previous_employment_to: null,
  
  // Demographics
  coapplicant_dob: null,
  coapplicant_ssn: null,
  coapplicant_birth_place: null,
  coapplicant_race: null,
  coapplicant_marital_status: null,
  coapplicant_anniversary: null,
  coapplicant_spouse_name: null,
  coapplicant_spouse_occupation: null,
  coapplicant_dependents_count: null,
});
