
-- Fix critical RLS policy gaps and remove duplicates

-- First, let's clean up existing policies and add proper ones for activities table
DROP POLICY IF EXISTS "Users can view accessible activities" ON public.activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON public.activities;

-- Create proper RLS policies for activities table
CREATE POLICY "Users can view activities based on hierarchy" 
  ON public.activities FOR SELECT 
  USING (public.can_access_user_data(user_id));

CREATE POLICY "Users can insert their own activities" 
  ON public.activities FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update activities based on hierarchy" 
  ON public.activities FOR UPDATE 
  USING (public.can_access_user_data(user_id));

CREATE POLICY "Users can delete activities based on hierarchy" 
  ON public.activities FOR DELETE 
  USING (public.can_access_user_data(user_id));

-- Fix audit_logs table - only admins should see audit logs
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "All authenticated users can insert audit logs" ON public.audit_logs;

CREATE POLICY "Only admins can view audit logs" 
  ON public.audit_logs FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'Admin');

CREATE POLICY "Users can insert their own audit logs" 
  ON public.audit_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Fix kpi_metrics table - add missing UPDATE/DELETE policies
DROP POLICY IF EXISTS "Users can view accessible KPI metrics" ON public.kpi_metrics;
DROP POLICY IF EXISTS "Users can insert own KPI metrics" ON public.kpi_metrics;

CREATE POLICY "Users can view KPI metrics based on hierarchy" 
  ON public.kpi_metrics FOR SELECT 
  USING (public.can_access_user_data(user_id));

CREATE POLICY "Users can insert their own KPI metrics" 
  ON public.kpi_metrics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update KPI metrics based on hierarchy" 
  ON public.kpi_metrics FOR UPDATE 
  USING (public.can_access_user_data(user_id));

CREATE POLICY "Users can delete KPI metrics based on hierarchy" 
  ON public.kpi_metrics FOR DELETE 
  USING (public.can_access_user_data(user_id));

-- Secure positions table
CREATE POLICY "Only admins can manage positions" 
  ON public.positions FOR ALL 
  USING (public.get_user_role(auth.uid()) = 'Admin');

-- Ensure proper policies exist for other critical tables
DROP POLICY IF EXISTS "Users can view contacts based on hierarchy" ON public.contacts;
DROP POLICY IF EXISTS "Users can insert their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update contacts based on hierarchy" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete contacts based on hierarchy" ON public.contacts;

CREATE POLICY "Users can view contacts based on hierarchy" 
  ON public.contacts FOR SELECT 
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can insert their own contacts" 
  ON public.contacts FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update contacts based on hierarchy" 
  ON public.contacts FOR UPDATE 
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can delete contacts based on hierarchy" 
  ON public.contacts FOR DELETE 
  USING (public.can_access_user_data(owner_id));

-- Add proper client data security
CREATE POLICY "Users can view clients based on hierarchy" 
  ON public.clients FOR SELECT 
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can insert their own clients" 
  ON public.clients FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update clients based on hierarchy" 
  ON public.clients FOR UPDATE 
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can delete clients based on hierarchy" 
  ON public.clients FOR DELETE 
  USING (public.can_access_user_data(owner_id));

-- Secure client liabilities
CREATE POLICY "Users can view client liabilities through client access" 
  ON public.client_liabilities FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_liabilities.client_id 
    AND public.can_access_user_data(clients.owner_id)
  ));

CREATE POLICY "Users can manage client liabilities through client access" 
  ON public.client_liabilities FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_liabilities.client_id 
    AND public.can_access_user_data(clients.owner_id)
  ));
