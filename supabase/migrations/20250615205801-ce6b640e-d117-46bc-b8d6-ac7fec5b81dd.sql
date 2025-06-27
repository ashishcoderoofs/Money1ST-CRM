
-- Add household_members_json column to clients table
ALTER TABLE public.clients 
ADD COLUMN household_members_json jsonb;
