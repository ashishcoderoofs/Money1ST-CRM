
/**
 * Client Form Schema and Validation
 * 
 * Centralized Zod schema definitions for client form validation.
 * This schema ensures consistent validation across all client forms and components.
 * 
 * Features:
 * - Comprehensive field validation for applicant and co-applicant data
 * - Dynamic validation based on form state (co-applicant inclusion)
 * - Nested object schemas for complex data types
 * - Error handling with user-friendly messages
 */

import { z } from "zod";

/**
 * Schema for household member objects
 */
const householdMemberSchema = z.object({
  first_name: z.string().optional(),
  mi: z.string().optional(),
  last_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  age: z.string().optional(),
  ssn: z.string().optional(),
  relationship: z.string().optional(),
  sex: z.string().optional(),
  monthly_income: z.string().optional(),
  tobacco_user: z.string().optional(),
  student: z.string().optional(),
});

/**
 * Schema for liability objects with conditional validation
 */
const liabilitySchema = z.object({
  id: z.string().optional(),
  debtor_type: z.string().min(1, "Debtor type is required"),
  liability_type: z.string().optional(),
  creditor_name: z.string().optional(),
  current_balance: z.number().optional(),
  monthly_payment: z.number().optional(),
  pay_off: z.boolean().optional(),
  property_address: z.string().optional(),
  property_value: z.number().optional(),
  gross_rent: z.number().optional(),
  escrow: z.string().optional(),
  taxes: z.number().optional(),
  hoi: z.number().optional(),
}).refine(
  (data) => {
    // If any meaningful data is provided, ensure debtor_type is present
    const hasMeaningfulData = data.liability_type || 
                             data.creditor_name || 
                             (data.current_balance && data.current_balance > 0) || 
                             (data.monthly_payment && data.monthly_payment > 0) ||
                             data.property_address ||
                             (data.property_value && data.property_value > 0);
    
    if (hasMeaningfulData && !data.debtor_type) {
      return false;
    }
    return true;
  },
  {
    message: "Debtor type is required when liability information is provided",
    path: ["debtor_type"],
  }
);

/**
 * Main client form schema with comprehensive field validation
 * 
 * Includes:
 * - Basic client information (status, dates, contacts)
 * - Applicant personal, contact, and employment information
 * - Co-applicant information (conditionally validated)
 * - Financial information (vehicles, homeowners, etc.)
 * - Complex data types (household members, liabilities)
 */
export const clientFormSchema = z.object({
  // ================================
  // BASIC CLIENT INFORMATION
  // ================================
  applicant: z.string().optional(),
  co_applicant: z.string().optional(),
  consultant_name: z.string().optional(),
  processor_name: z.string().optional(),
  total_debt: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).default(0),
  payoff_amount: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  status: z.enum(["draft", "submitted", "active", "inactive"]).default("draft"),
  entry_date: z.string().optional(),
  
  // Contact information
  applicant_contact: z.string().optional(),
  applicant_email: z.string().optional(),
  applicant_cell_phone: z.string().optional(),
  coapplicant_contact: z.string().optional(),
  coapplicant_email: z.string().optional(),
  coapplicant_cell_phone: z.string().optional(),
  co_applicant_total_debt: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),

  // Form state control
  include_co_applicant: z.boolean().optional(),

  // ================================
  // APPLICANT INFORMATION
  // ================================
  // Personal details
  applicant_title: z.string().optional(),
  applicant_first_name: z.string().optional(),
  applicant_mi: z.string().optional(),
  applicant_last_name: z.string().optional(),
  applicant_suffix: z.string().optional(),
  applicant_maiden_name: z.string().optional(),
  applicant_is_consultant: z.boolean().optional(),
  
  // Address information
  applicant_address: z.string().optional(),
  applicant_city: z.string().optional(),
  applicant_county: z.string().optional(),
  applicant_state: z.string().optional(),
  applicant_zip_code: z.string().optional(),
  applicant_time_at_address: z.string().optional(),
  applicant_previous_address: z.string().optional(),
  applicant_previous_address_time: z.string().optional(),
  
  // Contact fields
  applicant_home_phone: z.string().optional(),
  applicant_other_phone: z.string().optional(),
  applicant_fax: z.string().optional(),
  
  // Employment fields
  applicant_employment_status: z.string().optional(),
  applicant_business_owner: z.string().optional(),
  applicant_employer_name: z.string().optional(),
  applicant_employer_address: z.string().optional(),
  applicant_employer_city: z.string().optional(),
  applicant_employer_state: z.string().optional(),
  applicant_employer_zip: z.string().optional(),
  applicant_occupation: z.string().optional(),
  applicant_monthly_salary: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  applicant_employer_phone: z.string().optional(),
  applicant_start_date: z.string().optional(),
  applicant_end_date: z.string().optional(),
  applicant_additional_income: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  applicant_additional_income_source: z.string().optional(),
  applicant_previous_employer: z.string().optional(),
  applicant_previous_employer_address: z.string().optional(),
  applicant_previous_occupation: z.string().optional(),
  applicant_previous_employment_from: z.string().optional(),
  applicant_previous_employment_to: z.string().optional(),
  applicant_supervisor: z.string().optional(),
  
  // Personal information
  applicant_dob: z.string().optional(),
  applicant_ssn: z.string().optional(),
  applicant_birth_place: z.string().optional(),
  applicant_race: z.string().optional(),
  applicant_marital_status: z.string().optional(),
  applicant_anniversary: z.string().optional(),
  applicant_spouse_name: z.string().optional(),
  applicant_spouse_occupation: z.string().optional(),
  applicant_dependents_count: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),

  // ================================
  // CO-APPLICANT INFORMATION
  // ================================
  // NOTE: Co-applicant validation is conditional based on form state
  coapplicant_title: z.string().optional(),
  coapplicant_first_name: z.string().optional(),
  coapplicant_mi: z.string().optional(),
  coapplicant_last_name: z.string().optional(),
  coapplicant_suffix: z.string().optional(),
  coapplicant_maiden_name: z.string().optional(),
  coapplicant_is_consultant: z.boolean().optional(),
  
  // Address information
  coapplicant_address: z.string().optional(),
  coapplicant_city: z.string().optional(),
  coapplicant_county: z.string().optional(),
  coapplicant_state: z.string().optional(),
  coapplicant_zip_code: z.string().optional(),
  coapplicant_time_at_address: z.string().optional(),
  coapplicant_previous_address: z.string().optional(),
  coapplicant_previous_address_time: z.string().optional(),
  
  // Contact fields
  coapplicant_home_phone: z.string().optional(),
  coapplicant_other_phone: z.string().optional(),
  coapplicant_fax: z.string().optional(),
  
  // Employment fields
  coapplicant_employment_status: z.string().optional(),
  coapplicant_business_owner: z.string().optional(),
  coapplicant_employer_name: z.string().optional(),
  coapplicant_employer_address: z.string().optional(),
  coapplicant_employer_city: z.string().optional(),
  coapplicant_employer_state: z.string().optional(),
  coapplicant_employer_zip: z.string().optional(),
  coapplicant_occupation: z.string().optional(),
  coapplicant_monthly_salary: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  coapplicant_employer_phone: z.string().optional(),
  coapplicant_start_date: z.string().optional(),
  coapplicant_end_date: z.string().optional(),
  coapplicant_additional_income: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  coapplicant_additional_income_source: z.string().optional(),
  coapplicant_previous_employer: z.string().optional(),
  coapplicant_previous_employer_address: z.string().optional(),
  coapplicant_previous_occupation: z.string().optional(),
  coapplicant_previous_employment_from: z.string().optional(),
  coapplicant_previous_employment_to: z.string().optional(),
  coapplicant_supervisor: z.string().optional(),
  
  // Personal information
  coapplicant_dob: z.string().optional(),
  coapplicant_ssn: z.string().optional(),
  coapplicant_birth_place: z.string().optional(),
  coapplicant_race: z.string().optional(),
  coapplicant_marital_status: z.string().optional(),
  coapplicant_anniversary: z.string().optional(),
  coapplicant_spouse_name: z.string().optional(),
  coapplicant_spouse_occupation: z.string().optional(),
  coapplicant_dependents_count: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),

  // ================================
  // COMPLEX DATA TYPES
  // ================================
  household_members: z.array(householdMemberSchema).optional(),
  coapplicant_household_members: z.array(householdMemberSchema).optional(),
  liabilities: z.array(liabilitySchema).optional(),

  // ================================
  // FINANCIAL INFORMATION
  // ================================
  // Vehicle coverage
  vehicle_carrier: z.string().optional(),
  vehicle_6_month_premium: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  vehicle_expiration_date: z.string().optional(),
  vehicle_annual_premium: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  vehicle_6_month_premium_proposed: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  vehicle_savings: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  vehicle_app_date: z.string().optional(),
  vehicle_status: z.string().optional(),
  vehicle_status_date: z.string().optional(),
  vehicle_issue_date: z.string().optional(),
  vehicle_disburse_date: z.string().optional(),
  vehicle_dft: z.string().optional(),
  vehicle_dft_number: z.string().optional(),
  vehicle_units: z.boolean().optional(),
  
  // Homeowners information
  homeowners_address: z.string().optional(),
  homeowners_city: z.string().optional(),
  homeowners_state: z.string().optional(),
  homeowners_property_value: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  homeowners_year_built: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  homeowners_square_footage: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  homeowners_construction: z.string().optional(),
  homeowners_roof: z.string().optional(),
  homeowners_foundation: z.string().optional(),
  homeowners_current_provider: z.string().optional(),
  homeowners_current_premium: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  homeowners_proposed_premium: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  homeowners_savings: z.union([z.number(), z.string().transform((val) => val === "" ? 0 : Number(val))]).optional(),
  homeowners_current_deductible: z.string().optional(),
  homeowners_proposed_deductible: z.string().optional(),
  homeowners_smoke_detector: z.string().optional(),
  homeowners_fire_extinguisher: z.string().optional(),
  homeowners_monitored_burglar_alarm: z.string().optional(),
  homeowners_monitored_fire_alarm: z.string().optional(),
  homeowners_deadbolt_locks: z.string().optional(),
  homeowners_24_hour_security_guard: z.string().optional(),
}).refine(
  (data) => {
    // Only validate co-applicant fields if explicitly enabled
    // This prevents premature validation errors when users are just typing
    const includeCoApplicant = data.include_co_applicant || data.co_applicant;
    
    if (!includeCoApplicant) {
      return true; // No validation needed if co-applicant is not included
    }
    
    // Required fields when co-applicant is included
    const requiredFields = [
      { field: data.coapplicant_first_name, name: 'first name' },
      { field: data.coapplicant_last_name, name: 'last name' },
      { field: data.coapplicant_email, name: 'email' },
      { field: data.coapplicant_cell_phone, name: 'cell phone' },
      { field: data.coapplicant_address, name: 'address' },
      { field: data.coapplicant_city, name: 'city' }
    ];
    
    // Check if all required fields are filled
    return requiredFields.every(({ field }) => field && field.trim() !== '');
  },
  {
    message: "When co-applicant is included, first name, last name, email, cell phone, address, and city are required",
    path: ["coapplicant_first_name"],
  }
);

// Export the schema type for TypeScript inference
export type ClientFormData = z.infer<typeof clientFormSchema>;

// Export nested schemas for reuse
export { householdMemberSchema, liabilitySchema };
