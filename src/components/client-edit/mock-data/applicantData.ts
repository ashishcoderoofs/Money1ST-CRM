
import { Tables } from "@/integrations/supabase/types";

export const createApplicantData = (): Partial<Tables<"clients">> => ({
  // Contact fields
  applicant_contact: null,
  applicant_email: null,
  co_applicant_total_debt: null,
  
  // Name breakdown fields
  applicant_title: null,
  applicant_first_name: null,
  applicant_mi: null,
  applicant_last_name: null,
  applicant_suffix: null,
  applicant_maiden_name: null,
  applicant_is_consultant: null,
  
  // Address fields
  applicant_address: null,
  applicant_city: null,
  applicant_county: null,
  applicant_state: null,
  applicant_zip_code: null,
  applicant_time_at_address: null,
  applicant_previous_address: null,
  applicant_previous_address_time: null,
  
  // Contact fields
  applicant_home_phone: null,
  applicant_other_phone: null,
  applicant_fax: null,
  
  // Employment fields
  applicant_employment_status: null,
  applicant_business_owner: null,
  applicant_employer_name: null,
  applicant_employer_address: null,
  applicant_employer_city: null,
  applicant_employer_state: null,
  applicant_employer_zip: null,
  applicant_occupation: null,
  applicant_monthly_salary: null,
  applicant_employer_phone: null,
  applicant_start_date: null,
  applicant_end_date: null,
  applicant_additional_income: null,
  applicant_additional_income_source: null,
  applicant_previous_employer: null,
  applicant_previous_employer_address: null,
  applicant_previous_occupation: null,
  applicant_previous_employment_from: null,
  applicant_previous_employment_to: null,
  applicant_supervisor: null,
  
  // Demographics
  applicant_dob: null,
  applicant_ssn: null,
  applicant_birth_place: null,
  applicant_race: null,
  applicant_marital_status: null,
  applicant_anniversary: null,
  applicant_spouse_name: null,
  applicant_spouse_occupation: null,
  applicant_dependents_count: null,
});
