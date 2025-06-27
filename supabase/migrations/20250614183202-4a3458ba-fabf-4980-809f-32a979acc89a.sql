
-- Drop existing policies if they exist to ensure idempotency

-- Policies for Contacts
DROP POLICY IF EXISTS "Users can view contacts based on hierarchy" ON public.contacts;
DROP POLICY IF EXISTS "Users can insert their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update contacts based on hierarchy" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete contacts based on hierarchy" ON public.contacts;

-- Policies for Deals
DROP POLICY IF EXISTS "Users can view deals based on hierarchy" ON public.deals;
DROP POLICY IF EXISTS "Users can insert their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals based on hierarchy" ON public.deals;
DROP POLICY IF EXISTS "Users can delete deals based on hierarchy" ON public.deals;

-- Policies for Tasks
DROP POLICY IF EXISTS "Users can view tasks based on assignment or creation" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks based on assignment or creation" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks based on assignment or creation" ON public.tasks;

-- Enable RLS on core CRM tables (this is safe to run multiple times)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Contacts table
CREATE POLICY "Users can view contacts based on hierarchy"
  ON public.contacts FOR SELECT
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can insert their own contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update contacts based on hierarchy"
  ON public.contacts FOR UPDATE
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can delete contacts based on hierarchy"
  ON public.contacts FOR DELETE
  USING (public.can_access_user_data(owner_id));

-- RLS Policies for Deals table
CREATE POLICY "Users can view deals based on hierarchy"
  ON public.deals FOR SELECT
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can insert their own deals"
  ON public.deals FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update deals based on hierarchy"
  ON public.deals FOR UPDATE
  USING (public.can_access_user_data(owner_id));

CREATE POLICY "Users can delete deals based on hierarchy"
  ON public.deals FOR DELETE
  USING (public.can_access_user_data(owner_id));

-- RLS Policies for Tasks table
CREATE POLICY "Users can view tasks based on assignment or creation"
  ON public.tasks FOR SELECT
  USING (public.can_access_user_data(assigned_to) OR created_by = auth.uid());

CREATE POLICY "Users can insert tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update tasks based on assignment or creation"
  ON public.tasks FOR UPDATE
  USING (public.can_access_user_data(assigned_to) OR created_by = auth.uid());

CREATE POLICY "Users can delete tasks based on assignment or creation"
  ON public.tasks FOR DELETE
  USING (public.can_access_user_data(assigned_to) OR created_by = auth.uid());
