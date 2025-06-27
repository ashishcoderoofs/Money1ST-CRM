
-- Add the missing applicant_supervisor column to the clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS applicant_supervisor text;
