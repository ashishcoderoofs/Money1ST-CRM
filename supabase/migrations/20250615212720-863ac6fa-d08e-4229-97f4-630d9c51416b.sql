
-- Create a table for client liabilities
CREATE TABLE public.client_liabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  debtor_type TEXT NOT NULL CHECK (debtor_type IN ('Applicant', 'Co-Applicant', 'Joint')),
  liability_type TEXT,
  creditor_name TEXT,
  current_balance NUMERIC DEFAULT 0,
  monthly_payment NUMERIC DEFAULT 0,
  pay_off BOOLEAN DEFAULT false,
  property_address TEXT,
  property_value NUMERIC DEFAULT 0,
  gross_rent NUMERIC DEFAULT 0,
  escrow TEXT CHECK (escrow IN ('YES', 'NO', '')),
  taxes NUMERIC DEFAULT 0,
  hoi NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.client_liabilities ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view liabilities for clients they own
CREATE POLICY "Users can view liabilities for their clients" 
  ON public.client_liabilities 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = client_liabilities.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

-- Create policy that allows users to insert liabilities for their clients
CREATE POLICY "Users can create liabilities for their clients" 
  ON public.client_liabilities 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = client_liabilities.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

-- Create policy that allows users to update liabilities for their clients
CREATE POLICY "Users can update liabilities for their clients" 
  ON public.client_liabilities 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = client_liabilities.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

-- Create policy that allows users to delete liabilities for their clients
CREATE POLICY "Users can delete liabilities for their clients" 
  ON public.client_liabilities 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.clients 
      WHERE clients.id = client_liabilities.client_id 
      AND clients.owner_id = auth.uid()
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_liability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER liability_updated_at
  BEFORE UPDATE ON public.client_liabilities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_liability_updated_at();
