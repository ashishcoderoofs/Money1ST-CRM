
-- Add a table to manage page access permissions
CREATE TABLE public.page_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  role_name user_role NOT NULL,
  can_access BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_name, role_name)
);

-- Enable RLS on page_permissions
ALTER TABLE public.page_permissions ENABLE ROW LEVEL SECURITY;

-- Create policy for page_permissions - only admins can manage
CREATE POLICY "Only admins can view page permissions" 
ON public.page_permissions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);

CREATE POLICY "Only admins can insert page permissions" 
ON public.page_permissions FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);

CREATE POLICY "Only admins can update page permissions" 
ON public.page_permissions FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);

CREATE POLICY "Only admins can delete page permissions" 
ON public.page_permissions FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  )
);

-- Insert default permissions for all pages and roles
INSERT INTO public.page_permissions (page_name, role_name, can_access) VALUES
('Dashboard', 'Admin', true),
('Dashboard', 'Field Builder', true),
('Dashboard', 'Field Trainer', true),
('Dashboard', 'Sr. BMA', true),
('Dashboard', 'BMA', true),
('Dashboard', 'IBA', true),
('Securia', 'Admin', true),
('Securia', 'Field Builder', false),
('Securia', 'Field Trainer', false),
('Securia', 'Sr. BMA', false),
('Securia', 'BMA', false),
('Securia', 'IBA', false),
('Reports', 'Admin', true),
('Reports', 'Field Builder', true),
('Reports', 'Field Trainer', true),
('Reports', 'Sr. BMA', true),
('Reports', 'BMA', false),
('Reports', 'IBA', false),
('Organizational Chart', 'Admin', true),
('Organizational Chart', 'Field Builder', true),
('Organizational Chart', 'Field Trainer', true),
('Organizational Chart', 'Sr. BMA', true),
('Organizational Chart', 'BMA', false),
('Organizational Chart', 'IBA', false),
('Branch Development', 'Admin', true),
('Branch Development', 'Field Builder', true),
('Branch Development', 'Field Trainer', true),
('Branch Development', 'Sr. BMA', false),
('Branch Development', 'BMA', false),
('Branch Development', 'IBA', false),
('FNA Training', 'Admin', true),
('FNA Training', 'Field Builder', true),
('FNA Training', 'Field Trainer', true),
('FNA Training', 'Sr. BMA', true),
('FNA Training', 'BMA', true),
('FNA Training', 'IBA', true),
('Admin', 'Admin', true),
('Admin', 'Field Builder', false),
('Admin', 'Field Trainer', false),
('Admin', 'Sr. BMA', false),
('Admin', 'BMA', false),
('Admin', 'IBA', false);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_page_permissions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER page_permissions_updated_at
  BEFORE UPDATE ON public.page_permissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_page_permissions_updated_at();
