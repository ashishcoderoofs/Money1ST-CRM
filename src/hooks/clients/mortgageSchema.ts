import { z } from "zod";

export const mortgageSchema = z.object({
  id: z.string().optional(),
  client_id: z.string(),
  mortgage_id: z.number().optional(),

  // Property Information
  property_address: z.string().optional(),
  property_city: z.string().optional(),
  property_state: z.string().optional(),
  property_zip: z.string().optional(),
  zip_code: z.string().optional(),

  // Reference IDs
  applicant_id_ref: z.string().optional(),
  floan_id: z.string().optional(),
  consult_id: z.string().optional(),
  processor_id: z.string().optional(),
  lender_id: z.string().optional(),
  lender_name: z.string().optional(),

  // Existing Mortgage Information
  mortgage_type: z.string().optional(),
  original_loan_amount: z.number().optional(),
  current_balance: z.number().optional(),
  monthly_payment: z.number().optional(),
  interest_rate: z.number().optional(),
  occupancy_type: z.string().optional(),

  // First Mortgage Details
  first_mortgage_balance: z.number().optional(),
  first_mortgage_rate: z.number().optional(),
  first_mortgage_term: z.string().optional(),
  first_mortgage_payment: z.number().optional(),
  first_mortgage_lienholder: z.string().optional(),

  // Second Mortgage Details
  second_mortgage_balance: z.number().optional(),
  second_mortgage_rate: z.number().optional(),
  second_mortgage_term: z.string().optional(),
  second_mortgage_payment: z.number().optional(),
  second_mortgage_lienholder: z.string().optional(),

  // Property Details
  existing_balance: z.number().optional(),
  property_taxes: z.number().optional(),
  taxes_included_in_payment: z.string().optional(),
  taxes_included_in_payment_select: z.string().optional(),
  homeowner_insurance: z.number().optional(),
  insurance_included_in_payment: z.string().optional(),
  homeowner_insurance_included_select: z.string().optional(),
  purpose_of_loan: z.string().optional(),

  // Proposed First Loan
  proposed_first_loan_amount: z.number().optional(),
  proposed_first_rate: z.number().optional(),
  proposed_first_term: z.string().optional(),
  proposed_first_int_term: z.string().optional(),
  proposed_first_payment: z.number().optional(),

  // Proposed Second Loan
  proposed_second_loan_amount: z.number().optional(),
  proposed_second_rate: z.number().optional(),
  proposed_second_term: z.string().optional(),
  proposed_second_int_term: z.string().optional(),
  proposed_second_payment: z.number().optional(),

  // Summary & Calculations
  market_value: z.number().optional(),
  cash_to_borrower: z.number().optional(),
  loan_volume: z.number().optional(),
  appraisal_fee: z.number().optional(),
  estimated_fees_percent: z.number().optional(),
  estimated_fees_amount: z.number().optional(),
  ltv_percent: z.number().optional(),
  ltv_secondary: z.number().optional(),
  origination_percent: z.number().optional(),
  origination_amount: z.number().optional(),
  spr_percent: z.number().optional(),
  spr_amount: z.number().optional(),

  // Loan Options
  arm_5_1_rate: z.number().optional(),
  arm_5_1_payment: z.number().optional(),
  arm_7_1_rate: z.number().optional(),
  arm_7_1_payment: z.number().optional(),
  arm_10_1_rate: z.number().optional(),
  arm_10_1_payment: z.number().optional(),
  fixed_15_rate: z.number().optional(),
  fixed_15_payment: z.number().optional(),
  fixed_30_rate: z.number().optional(),
  fixed_30_payment: z.number().optional(),
  closing_cost: z.number().optional(),
  dti_percent: z.number().optional(),

  // Additional fields
  original_loan_amount_field: z.number().optional(),
  monthly_payment_field: z.number().optional(),
  interest_rate_field: z.number().optional(),
  arm_5_1_rate_field: z.number().optional(),
  arm_5_1_payment_field: z.number().optional(),
  arm_7_1_rate_field: z.number().optional(),
  arm_7_1_payment_field: z.number().optional(),
  arm_10_1_rate_field: z.number().optional(),
  arm_10_1_payment_field: z.number().optional(),
  fixed_15_rate_field: z.number().optional(),
  fixed_15_payment_field: z.number().optional(),
  fixed_30_rate_field: z.number().optional(),
  fixed_30_payment_field: z.number().optional(),
  closing_cost_field: z.number().optional(),
  dti_percent_field: z.number().optional(),
});
