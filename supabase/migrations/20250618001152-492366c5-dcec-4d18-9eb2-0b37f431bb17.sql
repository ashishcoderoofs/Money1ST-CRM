
-- Add missing columns to the clients table for the underwriting and other form fields
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS underwriting_address TEXT,
ADD COLUMN IF NOT EXISTS underwriting_city TEXT,
ADD COLUMN IF NOT EXISTS underwriting_state TEXT,
ADD COLUMN IF NOT EXISTS underwriting_client_id TEXT,
ADD COLUMN IF NOT EXISTS underwriting_credit_scores JSONB,
ADD COLUMN IF NOT EXISTS underwriting_cnh_option TEXT,
ADD COLUMN IF NOT EXISTS underwriting_tud_option TEXT,
ADD COLUMN IF NOT EXISTS underwriting_terms TEXT,
ADD COLUMN IF NOT EXISTS underwriting_programs TEXT,
ADD COLUMN IF NOT EXISTS underwriting_notes TEXT;

-- Add RLS policies for the clients table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clients' AND policyname = 'Clients: owners can select'
    ) THEN
        CREATE POLICY "Clients: owners can select" ON public.clients
        FOR SELECT USING (owner_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clients' AND policyname = 'Clients: owners can insert'
    ) THEN
        CREATE POLICY "Clients: owners can insert" ON public.clients
        FOR INSERT WITH CHECK (owner_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clients' AND policyname = 'Clients: owners can update'
    ) THEN
        CREATE POLICY "Clients: owners can update" ON public.clients
        FOR UPDATE USING (owner_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clients' AND policyname = 'Clients: owners can delete'
    ) THEN
        CREATE POLICY "Clients: owners can delete" ON public.clients
        FOR DELETE USING (owner_id = auth.uid());
    END IF;
END $$;

-- Enable RLS on the clients table if not already enabled
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
