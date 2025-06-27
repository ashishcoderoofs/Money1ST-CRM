
-- Add missing fields to clients table for co-applicant to match applicant fields
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS coapplicant_time_at_address text,
ADD COLUMN IF NOT EXISTS coapplicant_previous_address text,
ADD COLUMN IF NOT EXISTS coapplicant_previous_address_time text;

-- Update mortgages table to include all fields shown in the image
ALTER TABLE public.mortgages 
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS taxes_included_in_payment_select text,
ADD COLUMN IF NOT EXISTS homeowner_insurance_included_select text,
ADD COLUMN IF NOT EXISTS original_loan_amount_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_payment_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS interest_rate_field numeric DEFAULT 0;

-- Add loan options fields that might be missing
ALTER TABLE public.mortgages 
ADD COLUMN IF NOT EXISTS arm_5_1_rate_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS arm_5_1_payment_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS arm_7_1_rate_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS arm_7_1_payment_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS arm_10_1_rate_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS arm_10_1_payment_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fixed_15_rate_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fixed_15_payment_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fixed_30_rate_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fixed_30_payment_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS closing_cost_field numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS dti_percent_field numeric DEFAULT 0;
