
-- Create enum types for better data consistency
CREATE TYPE public.user_role AS ENUM ('Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA');
CREATE TYPE public.deal_stage AS ENUM ('Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost');
CREATE TYPE public.task_status AS ENUM ('Pending', 'In Progress', 'Completed', 'Cancelled');
CREATE TYPE public.task_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE public.activity_type AS ENUM ('Call', 'Email', 'Meeting', 'Note', 'Task', 'Deal Update');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'IBA',
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  tags TEXT[],
  notes TEXT,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deals/Opportunities table
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2),
  stage deal_stage NOT NULL DEFAULT 'Lead',
  expected_close_date DATE,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  status task_status NOT NULL DEFAULT 'Pending',
  priority task_priority NOT NULL DEFAULT 'Medium',
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity timeline table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KPI metrics table
CREATE TABLE public.kpi_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(12,2) NOT NULL,
  period_type TEXT NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'yearly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lineage tracking table for team hierarchy
CREATE TABLE public.team_lineage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  manager_id UUID REFERENCES public.profiles(id),
  level INTEGER NOT NULL DEFAULT 1,
  path TEXT[], -- Array to store the full hierarchy path
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ
);

-- Compensation table
CREATE TABLE public.compensation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  deal_id UUID REFERENCES public.deals(id),
  amount DECIMAL(12,2) NOT NULL,
  compensation_type TEXT NOT NULL, -- 'commission', 'bonus', 'override'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compensation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Security definer function to check if user can access another user's data
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  user_role_val := public.get_current_user_role();
  
  -- Admin can access all data
  IF user_role_val = 'Admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Users can access their own data
  IF current_user_id = target_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Check if current user is manager of target user (hierarchy access down only)
  RETURN EXISTS (
    SELECT 1 FROM public.team_lineage tl
    WHERE tl.user_id = target_user_id 
    AND current_user_id = ANY(
      SELECT unnest(path::UUID[]) FROM public.team_lineage 
      WHERE user_id = target_user_id AND effective_to IS NULL
    )
    AND tl.effective_to IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles
CREATE POLICY "Users can view accessible profiles" ON public.profiles
  FOR SELECT USING (public.can_access_user_data(id));

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'Admin');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for contacts
CREATE POLICY "Users can view accessible contacts" ON public.contacts
  FOR SELECT USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can insert own contacts" ON public.contacts
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update accessible contacts" ON public.contacts
  FOR UPDATE USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can delete accessible contacts" ON public.contacts
  FOR DELETE USING (public.can_access_user_data(owner_id));

-- RLS Policies for deals
CREATE POLICY "Users can view accessible deals" ON public.deals
  FOR SELECT USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can insert own deals" ON public.deals
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update accessible deals" ON public.deals
  FOR UPDATE USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can delete accessible deals" ON public.deals
  FOR DELETE USING (public.can_access_user_data(owner_id));

-- RLS Policies for tasks
CREATE POLICY "Users can view accessible tasks" ON public.tasks
  FOR SELECT USING (public.can_access_user_data(assigned_to) OR public.can_access_user_data(created_by));

CREATE POLICY "Users can insert tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update accessible tasks" ON public.tasks
  FOR UPDATE USING (public.can_access_user_data(assigned_to) OR public.can_access_user_data(created_by));

CREATE POLICY "Users can delete accessible tasks" ON public.tasks
  FOR DELETE USING (public.can_access_user_data(created_by));

-- RLS Policies for activities
CREATE POLICY "Users can view accessible activities" ON public.activities
  FOR SELECT USING (public.can_access_user_data(user_id));

CREATE POLICY "Users can insert own activities" ON public.activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for KPI metrics
CREATE POLICY "Users can view accessible KPI metrics" ON public.kpi_metrics
  FOR SELECT USING (public.can_access_user_data(user_id));

CREATE POLICY "Users can insert own KPI metrics" ON public.kpi_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for team lineage
CREATE POLICY "Users can view accessible team lineage" ON public.team_lineage
  FOR SELECT USING (public.can_access_user_data(user_id));

CREATE POLICY "Admins can manage team lineage" ON public.team_lineage
  FOR ALL USING (public.get_current_user_role() = 'Admin');

-- RLS Policies for compensation
CREATE POLICY "Users can view accessible compensation" ON public.compensation
  FOR SELECT USING (public.can_access_user_data(user_id));

CREATE POLICY "Admins can manage compensation" ON public.compensation
  FOR ALL USING (public.get_current_user_role() = 'Admin');

-- RLS Policies for audit logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (public.get_current_user_role() = 'Admin');

CREATE POLICY "All authenticated users can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update lineage when manager changes
CREATE OR REPLACE FUNCTION public.update_team_lineage()
RETURNS TRIGGER AS $$
BEGIN
  -- Close previous lineage record
  UPDATE public.team_lineage 
  SET effective_to = NOW()
  WHERE user_id = NEW.id AND effective_to IS NULL;
  
  -- Create new lineage record
  INSERT INTO public.team_lineage (user_id, manager_id, level, path)
  VALUES (
    NEW.id,
    NEW.manager_id,
    COALESCE((
      SELECT level + 1 FROM public.team_lineage 
      WHERE user_id = NEW.manager_id AND effective_to IS NULL
    ), 1),
    COALESCE((
      SELECT array_append(path, NEW.manager_id) FROM public.team_lineage 
      WHERE user_id = NEW.manager_id AND effective_to IS NULL
    ), ARRAY[NEW.manager_id])
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lineage when profile manager changes
CREATE TRIGGER on_profile_manager_change
  AFTER INSERT OR UPDATE OF manager_id ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_team_lineage();
