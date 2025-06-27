
-- First, correct the can_access_user_data function for checking hierarchy.
-- This version is simpler, more efficient, and corrects a potential type-casting bug.
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
DECLARE
    user_role_val user_role;
    current_user_id UUID := auth.uid();
BEGIN
    -- Users can always access their own data.
    IF current_user_id = target_user_id THEN
        RETURN TRUE;
    END IF;

    -- Check the user's role to see if they are an admin.
    -- This query is safe from recursion because this function isn't used on the profiles table RLS.
    SELECT role INTO user_role_val FROM public.profiles WHERE id = current_user_id;
    IF user_role_val = 'Admin' THEN
        RETURN TRUE;
    END IF;

    -- Check if the current user is in the management path of the target user.
    RETURN EXISTS (
        SELECT 1
        FROM public.team_lineage
        WHERE user_id = target_user_id
          AND current_user_id::text = ANY(path)
          AND effective_to IS NULL
    );
END;
$function$;

-- Policies for Tasks
-- Drop old policies first to apply stricter ones.
DROP POLICY IF EXISTS "Users can view tasks based on assignment or creation" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks based on assignment or creation" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks based on assignment or creation" ON public.tasks;

-- Recreate policies with stricter checks for task assignment.

-- VIEW policy is unchanged.
CREATE POLICY "Users can view tasks based on assignment or creation"
  ON public.tasks FOR SELECT
  USING (public.can_access_user_data(assigned_to) OR created_by = auth.uid());

-- INSERT policy now also checks if the assignee is accessible by the creator.
CREATE POLICY "Users can insert tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (created_by = auth.uid() AND public.can_access_user_data(assigned_to));

-- UPDATE policy now also has a WITH CHECK clause to validate the new assignee.
CREATE POLICY "Users can update tasks based on assignment or creation"
  ON public.tasks FOR UPDATE
  USING (public.can_access_user_data(assigned_to) OR created_by = auth.uid())
  WITH CHECK (public.can_access_user_data(assigned_to));

-- DELETE policy is unchanged.
CREATE POLICY "Users can delete tasks based on assignment or creation"
  ON public.tasks FOR DELETE
  USING (public.can_access_user_data(assigned_to) OR created_by = auth.uid());
