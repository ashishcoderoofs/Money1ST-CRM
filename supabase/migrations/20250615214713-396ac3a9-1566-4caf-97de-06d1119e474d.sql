
-- Create mortgages table
CREATE TABLE public.mortgages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  mortgage_id integer,
  
  -- Property Information
  property_address text,
  property_city text,
  property_state text,
  property_zip text,
  
  -- Reference IDs
  applicant_id_ref text,
  floan_id text,
  consult_id text,
  processor_id text,
  lender_id text,
  lender_name text,
  
  -- Mortgage Basic Info
  mortgage_type text,
  original_loan_amount numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  monthly_payment numeric DEFAULT 0,
  interest_rate numeric DEFAULT 0,
  
  -- Existing Mortgage Details
  occupancy_type text,
  
  -- First Mortgage
  first_mortgage_balance numeric DEFAULT 0,
  first_mortgage_rate numeric DEFAULT 0,
  first_mortgage_term text,
  first_mortgage_payment numeric DEFAULT 0,
  first_mortgage_lienholder text,
  
  -- Second Mortgage
  second_mortgage_balance numeric DEFAULT 0,
  second_mortgage_rate numeric DEFAULT 0,
  second_mortgage_term text,
  second_mortgage_payment numeric DEFAULT 0,
  second_mortgage_lienholder text,
  
  -- General Existing Fields
  existing_balance numeric DEFAULT 0,
  property_taxes numeric DEFAULT 0,
  taxes_included_in_payment text,
  homeowner_insurance numeric DEFAULT 0,
  insurance_included_in_payment text,
  purpose_of_loan text,
  
  -- Proposed Loan Section
  proposed_first_loan_amount numeric DEFAULT 0,
  proposed_first_rate numeric DEFAULT 0,
  proposed_first_term text,
  proposed_first_int_term text,
  proposed_first_payment numeric DEFAULT 0,
  
  proposed_second_loan_amount numeric DEFAULT 0,
  proposed_second_rate numeric DEFAULT 0,
  proposed_second_term text,
  proposed_second_int_term text,
  proposed_second_payment numeric DEFAULT 0,
  
  -- Summary & Calculations
  market_value numeric DEFAULT 0,
  cash_to_borrower numeric DEFAULT 0,
  loan_volume numeric DEFAULT 0,
  appraisal_fee numeric DEFAULT 0,
  estimated_fees_percent numeric DEFAULT 0,
  estimated_fees_amount numeric DEFAULT 0,
  ltv_percent numeric DEFAULT 0,
  ltv_secondary numeric DEFAULT 0,
  origination_percent numeric DEFAULT 0,
  origination_amount numeric DEFAULT 0,
  spr_percent numeric DEFAULT 0,
  spr_amount numeric DEFAULT 0,
  
  -- Loan Options
  arm_5_1_rate numeric DEFAULT 0,
  arm_5_1_payment numeric DEFAULT 0,
  arm_7_1_rate numeric DEFAULT 0,
  arm_7_1_payment numeric DEFAULT 0,
  arm_10_1_rate numeric DEFAULT 0,
  arm_10_1_payment numeric DEFAULT 0,
  
  fixed_15_rate numeric DEFAULT 0,
  fixed_15_payment numeric DEFAULT 0,
  fixed_30_rate numeric DEFAULT 0,
  fixed_30_payment numeric DEFAULT 0,
  
  closing_cost numeric DEFAULT 0,
  dti_percent numeric DEFAULT 0,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.mortgages ENABLE ROW LEVEL SECURITY;

-- Create policies for mortgages
CREATE POLICY "Users can view mortgages for their clients" 
  ON public.mortgages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = mortgages.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create mortgages for their clients" 
  ON public.mortgages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = mortgages.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update mortgages for their clients" 
  ON public.mortgages 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = mortgages.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete mortgages for their clients" 
  ON public.mortgages 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = mortgages.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER set_mortgage_updated_at
  BEFORE UPDATE ON public.mortgages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_client_updated_at();

-- Create sequence for mortgage_id
CREATE SEQUENCE public.mortgages_mortgage_id_seq;
ALTER TABLE public.mortgages ALTER COLUMN mortgage_id SET DEFAULT nextval('public.mortgages_mortgage_id_seq');
