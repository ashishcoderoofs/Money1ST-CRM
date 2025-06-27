
-- Add co-applicant specific fields to the clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS coapplicant_contact TEXT,
ADD COLUMN IF NOT EXISTS coapplicant_email TEXT,
ADD COLUMN IF NOT EXISTS co_applicant_total_debt NUMERIC DEFAULT 0;

-- Add additional applicant fields that might be missing
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS applicant_contact TEXT,
ADD COLUMN IF NOT EXISTS applicant_email TEXT;
