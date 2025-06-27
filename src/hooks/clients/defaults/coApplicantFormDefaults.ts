
import { Client } from "../types";

export function getCoApplicantFormDefaults(existingClient?: Client) {
  return {
    // Co-applicant Details
    coapplicant_title: existingClient?.coapplicant_title || "",
    coapplicant_first_name: existingClient?.coapplicant_first_name || "",
    coapplicant_mi: existingClient?.coapplicant_mi || "",
    coapplicant_last_name: existingClient?.coapplicant_last_name || "",
    coapplicant_suffix: existingClient?.coapplicant_suffix || "",
    coapplicant_maiden_name: existingClient?.coapplicant_maiden_name || "",
    coapplicant_is_consultant: existingClient?.coapplicant_is_consultant || false,
    
    // Co-applicant Address
    coapplicant_address: existingClient?.coapplicant_address || "",
    coapplicant_city: existingClient?.coapplicant_city || "",
    coapplicant_county: existingClient?.coapplicant_county || "",
    coapplicant_state: existingClient?.coapplicant_state || "",
    coapplicant_zip_code: existingClient?.coapplicant_zip_code || "",
    coapplicant_time_at_address: existingClient?.coapplicant_time_at_address || "",
    coapplicant_previous_address: existingClient?.coapplicant_previous_address || "",
    coapplicant_previous_address_time: existingClient?.coapplicant_previous_address_time || "",
    
    // Co-applicant Contact
    coapplicant_home_phone: existingClient?.coapplicant_home_phone || "",
    coapplicant_other_phone: existingClient?.coapplicant_other_phone || "",
    coapplicant_fax: existingClient?.coapplicant_fax || "",
    
    // Co-applicant Employment
    coapplicant_employment_status: existingClient?.coapplicant_employment_status || "",
    coapplicant_business_owner: existingClient?.coapplicant_business_owner || "",
    coapplicant_employer_name: existingClient?.coapplicant_employer_name || "",
    coapplicant_employer_address: existingClient?.coapplicant_employer_address || "",
    coapplicant_employer_city: existingClient?.coapplicant_employer_city || "",
    coapplicant_employer_state: existingClient?.coapplicant_employer_state || "",
    coapplicant_employer_zip: existingClient?.coapplicant_employer_zip || "",
    coapplicant_occupation: existingClient?.coapplicant_occupation || "",
    coapplicant_monthly_salary: existingClient?.coapplicant_monthly_salary || 0,
    coapplicant_employer_phone: existingClient?.coapplicant_employer_phone || "",
    coapplicant_start_date: existingClient?.coapplicant_start_date || "",
    coapplicant_end_date: existingClient?.coapplicant_end_date || "",
    coapplicant_additional_income: existingClient?.coapplicant_additional_income || 0,
    coapplicant_additional_income_source: existingClient?.coapplicant_additional_income_source || "",
    coapplicant_previous_employer: existingClient?.coapplicant_previous_employer || "",
    coapplicant_previous_employer_address: existingClient?.coapplicant_previous_employer_address || "",
    coapplicant_previous_occupation: existingClient?.coapplicant_previous_occupation || "",
    coapplicant_previous_employment_from: existingClient?.coapplicant_previous_employment_from || "",
    coapplicant_previous_employment_to: existingClient?.coapplicant_previous_employment_to || "",
    
    // Co-applicant Demographics
    coapplicant_dob: existingClient?.coapplicant_dob || "",
    coapplicant_ssn: existingClient?.coapplicant_ssn || "",
    coapplicant_birth_place: existingClient?.coapplicant_birth_place || "",
    coapplicant_race: existingClient?.coapplicant_race || "",
    coapplicant_marital_status: existingClient?.coapplicant_marital_status || "",
    coapplicant_anniversary: existingClient?.coapplicant_anniversary || "",
    coapplicant_spouse_name: existingClient?.coapplicant_spouse_name || "",
    coapplicant_spouse_occupation: existingClient?.coapplicant_spouse_occupation || "",
    coapplicant_dependents_count: existingClient?.coapplicant_dependents_count || 0,
  };
}
