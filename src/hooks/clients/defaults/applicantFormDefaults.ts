
import { Client } from "../types";

export function getApplicantFormDefaults(existingClient?: Client) {
  return {
    // Name Details
    applicant_title: existingClient?.applicant_title || "",
    applicant_first_name: existingClient?.applicant_first_name || "",
    applicant_mi: existingClient?.applicant_mi || "",
    applicant_last_name: existingClient?.applicant_last_name || "",
    applicant_suffix: existingClient?.applicant_suffix || "",
    applicant_maiden_name: existingClient?.applicant_maiden_name || "",
    applicant_is_consultant: existingClient?.applicant_is_consultant || false,
    
    // Address
    applicant_address: existingClient?.applicant_address || "",
    applicant_city: existingClient?.applicant_city || "",
    applicant_county: existingClient?.applicant_county || "",
    applicant_state: existingClient?.applicant_state || "",
    applicant_zip_code: existingClient?.applicant_zip_code || "",
    applicant_time_at_address: existingClient?.applicant_time_at_address || "",
    applicant_previous_address: existingClient?.applicant_previous_address || "",
    applicant_previous_address_time: existingClient?.applicant_previous_address_time || "",
    
    // Contact
    applicant_home_phone: existingClient?.applicant_home_phone || "",
    applicant_other_phone: existingClient?.applicant_other_phone || "",
    applicant_fax: existingClient?.applicant_fax || "",
    
    // Employment
    applicant_employment_status: existingClient?.applicant_employment_status || "",
    applicant_business_owner: existingClient?.applicant_business_owner || "",
    applicant_employer_name: existingClient?.applicant_employer_name || "",
    applicant_employer_address: existingClient?.applicant_employer_address || "",
    applicant_employer_city: existingClient?.applicant_employer_city || "",
    applicant_employer_state: existingClient?.applicant_employer_state || "",
    applicant_employer_zip: existingClient?.applicant_employer_zip || "",
    applicant_occupation: existingClient?.applicant_occupation || "",
    applicant_monthly_salary: existingClient?.applicant_monthly_salary || 0,
    applicant_employer_phone: existingClient?.applicant_employer_phone || "",
    applicant_start_date: existingClient?.applicant_start_date || "",
    applicant_end_date: existingClient?.applicant_end_date || "",
    applicant_additional_income: existingClient?.applicant_additional_income || 0,
    applicant_additional_income_source: existingClient?.applicant_additional_income_source || "",
    applicant_previous_employer: existingClient?.applicant_previous_employer || "",
    applicant_previous_employer_address: existingClient?.applicant_previous_employer_address || "",
    applicant_previous_occupation: existingClient?.applicant_previous_occupation || "",
    applicant_previous_employment_from: existingClient?.applicant_previous_employment_from || "",
    applicant_previous_employment_to: existingClient?.applicant_previous_employment_to || "",
    applicant_supervisor: (existingClient as any)?.applicant_supervisor || "",
    
    // Demographics - Convert empty strings to null for date fields
    applicant_dob: existingClient?.applicant_dob || "",
    applicant_ssn: existingClient?.applicant_ssn || "",
    applicant_birth_place: existingClient?.applicant_birth_place || "",
    applicant_race: existingClient?.applicant_race || "",
    applicant_marital_status: existingClient?.applicant_marital_status || "",
    applicant_anniversary: existingClient?.applicant_anniversary || "",
    applicant_spouse_name: existingClient?.applicant_spouse_name || "",
    applicant_spouse_occupation: existingClient?.applicant_spouse_occupation || "",
    applicant_dependents_count: existingClient?.applicant_dependents_count || 0,
  };
}
