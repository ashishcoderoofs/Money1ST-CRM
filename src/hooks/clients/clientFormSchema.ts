
import { z } from "zod";

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

export const clientFormSchema = z.object({
  applicant: z.string().min(1, "Primary applicant name is required"),
  co_applicant: z.string().optional(),
  consultant_name: z.string().optional(),
  processor_name: z.string().optional(),
  total_debt: z.number().min(0, "Total debt must be non-negative"),
  payoff_amount: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  status: z.enum(["Open", "Closed"]),
  entry_date: z.string(),
  // Contact fields
  applicant_contact: z.string().optional(),
  applicant_email: z.string().email().optional().or(z.literal("")),
  coapplicant_contact: z.string().optional(),
  coapplicant_email: z.string().email().optional().or(z.literal("")),
  co_applicant_total_debt: z.number().optional(),
  // Name breakdown fields
  applicant_title: z.string().optional(),
  applicant_first_name: z.string().optional(),
  applicant_mi: z.string().optional(),
  applicant_last_name: z.string().optional(),
  applicant_suffix: z.string().optional(),
  applicant_maiden_name: z.string().optional(),
  applicant_is_consultant: z.boolean().optional(),
  // Address fields
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
  // Demographics
  applicant_dob: z.string().optional(),
  applicant_ssn: z.string().optional(),
  applicant_birth_place: z.string().optional(),
  applicant_race: z.string().optional(),
  applicant_marital_status: z.string().optional(),
  applicant_anniversary: z.string().optional(),
  applicant_spouse_name: z.string().optional(),
  applicant_spouse_occupation: z.string().optional(),
  applicant_dependents_count: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  // Co-applicant fields
  coapplicant_title: z.string().optional(),
  coapplicant_first_name: z.string().optional(),
  coapplicant_mi: z.string().optional(),
  coapplicant_last_name: z.string().optional(),
  coapplicant_suffix: z.string().optional(),
  coapplicant_maiden_name: z.string().optional(),
  coapplicant_is_consultant: z.boolean().optional(),
  coapplicant_address: z.string().optional(),
  coapplicant_city: z.string().optional(),
  coapplicant_county: z.string().optional(),
  coapplicant_state: z.string().optional(),
  coapplicant_zip_code: z.string().optional(),
  coapplicant_time_at_address: z.string().optional(),
  coapplicant_previous_address: z.string().optional(),
  coapplicant_previous_address_time: z.string().optional(),
  coapplicant_home_phone: z.string().optional(),
  coapplicant_other_phone: z.string().optional(),
  coapplicant_fax: z.string().optional(),
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
  coapplicant_dob: z.string().optional(),
  coapplicant_ssn: z.string().optional(),
  coapplicant_birth_place: z.string().optional(),
  coapplicant_race: z.string().optional(),
  coapplicant_marital_status: z.string().optional(),
  coapplicant_anniversary: z.string().optional(),
  coapplicant_spouse_name: z.string().optional(),
  coapplicant_spouse_occupation: z.string().optional(),
  coapplicant_dependents_count: z.union([z.number(), z.string().transform((val) => val === "" ? undefined : Number(val))]).optional(),
  // Household members
  household_members: z.array(householdMemberSchema).optional(),
  coapplicant_household_members: z.array(householdMemberSchema).optional(),
  // Liabilities
  liabilities: z.array(liabilitySchema).optional(),
});
