import { Tables } from "@/integrations/supabase/types";

export interface MortgageFormValues {
  id?: string;
  client_id: string;
  mortgage_id?: number;

  // Property Information
  property_address?: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  zip_code?: string;

  // Reference IDs
  applicant_id_ref?: string;
  floan_id?: string;
  consult_id?: string;
  processor_id?: string;
  lender_id?: string;
  lender_name?: string;

  // Existing Mortgage Information
  mortgage_type?: string;
  original_loan_amount?: number;
  current_balance?: number;
  monthly_payment?: number;
  interest_rate?: number;
  occupancy_type?: string;

  // First Mortgage Details
  first_mortgage_balance?: number;
  first_mortgage_rate?: number;
  first_mortgage_term?: string;
  first_mortgage_payment?: number;
  first_mortgage_lienholder?: string;

  // Second Mortgage Details
  second_mortgage_balance?: number;
  second_mortgage_rate?: number;
  second_mortgage_term?: string;
  second_mortgage_payment?: number;
  second_mortgage_lienholder?: string;

  // Property Details
  existing_balance?: number;
  property_taxes?: number;
  taxes_included_in_payment?: string;
  taxes_included_in_payment_select?: string;
  homeowner_insurance?: number;
  insurance_included_in_payment?: string;
  homeowner_insurance_included_select?: string;
  purpose_of_loan?: string;

  // Proposed First Loan
  proposed_first_loan_amount?: number;
  proposed_first_rate?: number;
  proposed_first_term?: string;
  proposed_first_int_term?: string;
  proposed_first_payment?: number;

  // Proposed Second Loan
  proposed_second_loan_amount?: number;
  proposed_second_rate?: number;
  proposed_second_term?: string;
  proposed_second_int_term?: string;
  proposed_second_payment?: number;

  // Summary & Calculations
  market_value?: number;
  cash_to_borrower?: number;
  loan_volume?: number;
  appraisal_fee?: number;
  estimated_fees_percent?: number;
  estimated_fees_amount?: number;
  ltv_percent?: number;
  ltv_secondary?: number;
  origination_percent?: number;
  origination_amount?: number;
  spr_percent?: number;
  spr_amount?: number;

  // Loan Options
  arm_5_1_rate?: number;
  arm_5_1_payment?: number;
  arm_7_1_rate?: number;
  arm_7_1_payment?: number;
  arm_10_1_rate?: number;
  arm_10_1_payment?: number;
  fixed_15_rate?: number;
  fixed_15_payment?: number;
  fixed_30_rate?: number;
  fixed_30_payment?: number;
  closing_cost?: number;
  dti_percent?: number;

  // Additional fields from database
  original_loan_amount_field?: number;
  monthly_payment_field?: number;
  interest_rate_field?: number;
  arm_5_1_rate_field?: number;
  arm_5_1_payment_field?: number;
  arm_7_1_rate_field?: number;
  arm_7_1_payment_field?: number;
  arm_10_1_rate_field?: number;
  arm_10_1_payment_field?: number;
  fixed_15_rate_field?: number;
  fixed_15_payment_field?: number;
  fixed_30_rate_field?: number;
  fixed_30_payment_field?: number;
  closing_cost_field?: number;
  dti_percent_field?: number;
}

export type Mortgage = Tables<"mortgages">;
