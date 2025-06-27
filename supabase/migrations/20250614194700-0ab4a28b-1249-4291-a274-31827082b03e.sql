
-- Add CFS Information fields to the profiles table
ALTER TABLE public.profiles
ADD COLUMN ssn TEXT,
ADD COLUMN ein TEXT,
ADD COLUMN hire_date DATE,
ADD COLUMN years_with_frq INTEGER,
ADD COLUMN company_name TEXT,
ADD COLUMN cfs_certification_date DATE,
ADD COLUMN effective_date DATE,
ADD COLUMN member_type TEXT,
ADD COLUMN mbr_amt NUMERIC,
ADD COLUMN pay_type TEXT,
ADD COLUMN mp_fee NUMERIC,
ADD COLUMN cfs_status TEXT,
ADD COLUMN status_date DATE;

-- Create a licenses table
CREATE TABLE public.licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  license_type TEXT NOT NULL,
  license_number TEXT,
  issue_date DATE,
  expiration_date DATE,
  issuing_authority TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  payment_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to the licenses table
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Create policies for licenses table
CREATE POLICY "Users can view accessible licenses" 
  ON public.licenses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = licenses.consultant_id 
      AND can_access_user_data(profiles.id)
    )
  );

CREATE POLICY "Users can manage accessible licenses" 
  ON public.licenses 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = licenses.consultant_id 
      AND can_access_user_data(profiles.id)
    )
  );

-- Add Row Level Security (RLS) to the payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view accessible payments" 
  ON public.payments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = payments.consultant_id 
      AND can_access_user_data(profiles.id)
    )
  );

CREATE POLICY "Users can manage accessible payments" 
  ON public.payments 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = payments.consultant_id 
      AND can_access_user_data(profiles.id)
    )
  );
