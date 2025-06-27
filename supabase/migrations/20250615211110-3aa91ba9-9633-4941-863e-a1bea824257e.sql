
-- Add coapplicant_household_members_json column to clients table
ALTER TABLE public.clients 
ADD COLUMN coapplicant_household_members_json jsonb;
