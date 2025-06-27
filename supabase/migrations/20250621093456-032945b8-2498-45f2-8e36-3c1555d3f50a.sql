
-- Add the missing payoff_amount column to the clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS payoff_amount numeric DEFAULT 0;
