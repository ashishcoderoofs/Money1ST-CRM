
-- 1. Create the clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_number SERIAL UNIQUE, -- for an easy reading Client ID
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  applicant TEXT NOT NULL,
  co_applicant TEXT,
  consultant_name TEXT,
  processor_name TEXT,
  total_debt NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Open', -- values: 'Open', 'Closed'
  owner_id UUID NOT NULL, -- profile id of creator for RLS
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 3. Allow select for owners
CREATE POLICY "Clients: owners can select" ON public.clients
  FOR SELECT USING (owner_id = auth.uid());

-- 4. Allow insert for logged-in users and autopopulate owner_id
CREATE POLICY "Clients: owners can insert" ON public.clients
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- 5. Allow update for owners
CREATE POLICY "Clients: owners can update" ON public.clients
  FOR UPDATE USING (owner_id = auth.uid());

-- 6. Allow delete for owners
CREATE POLICY "Clients: owners can delete" ON public.clients
  FOR DELETE USING (owner_id = auth.uid());

-- 7. Update updated_at on row modification
CREATE OR REPLACE FUNCTION public.set_client_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_client_updated_at ON public.clients;
CREATE TRIGGER trigger_set_client_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_client_updated_at();
