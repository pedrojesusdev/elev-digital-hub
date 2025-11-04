-- Add company tracking to profiles and implement company-level data isolation

-- 1. Add user_company column to profiles
ALTER TABLE public.profiles 
ADD COLUMN user_company text;

-- 2. Create a security definer function to get user's company
CREATE OR REPLACE FUNCTION public.get_user_company(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_company
  FROM public.profiles
  WHERE id = _user_id
$$;

-- 3. Update RLS policies for leads table to enforce company isolation
DROP POLICY IF EXISTS "Staff can view leads" ON public.leads;
CREATE POLICY "Staff can view leads from their company"
ON public.leads
FOR SELECT
TO authenticated
USING (
  -- Super admins can see all companies
  public.has_role(auth.uid(), 'super_admin')
  OR
  -- Other staff can only see their company's leads
  (
    (public.has_role(auth.uid(), 'readonly') OR public.has_role(auth.uid(), 'admin'))
    AND empresa = public.get_user_company(auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can insert leads" ON public.leads;
CREATE POLICY "Admins can insert leads for their company"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads from their company"
ON public.leads
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads from their company"
ON public.leads
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
);

-- 4. Update RLS policies for automations table
DROP POLICY IF EXISTS "Admins can manage automations" ON public.automations;
DROP POLICY IF EXISTS "Readonly users can view automations" ON public.automations;

CREATE POLICY "Staff can view automations from their company"
ON public.automations
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    (public.has_role(auth.uid(), 'readonly') OR public.has_role(auth.uid(), 'admin'))
    AND empresa = public.get_user_company(auth.uid())
  )
);

CREATE POLICY "Admins can manage automations for their company"
ON public.automations
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
);

-- 5. Update RLS policies for calendar_events table
DROP POLICY IF EXISTS "Admins can manage calendar_events" ON public.calendar_events;
DROP POLICY IF EXISTS "Readonly users can view calendar_events" ON public.calendar_events;

CREATE POLICY "Staff can view calendar events from their company"
ON public.calendar_events
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    (public.has_role(auth.uid(), 'readonly') OR public.has_role(auth.uid(), 'admin'))
    AND (empresa = public.get_user_company(auth.uid()) OR empresa IS NULL)
  )
);

CREATE POLICY "Admins can manage calendar events for their company"
ON public.calendar_events
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND (empresa = public.get_user_company(auth.uid()) OR empresa IS NULL)
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND (empresa = public.get_user_company(auth.uid()) OR empresa IS NULL)
  )
);

-- 6. Update RLS policies for social_media_services table
DROP POLICY IF EXISTS "Admins can manage social_media_services" ON public.social_media_services;
DROP POLICY IF EXISTS "Readonly users can view social_media_services" ON public.social_media_services;

CREATE POLICY "Staff can view social media services from their company"
ON public.social_media_services
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    (public.has_role(auth.uid(), 'readonly') OR public.has_role(auth.uid(), 'admin'))
    AND empresa = public.get_user_company(auth.uid())
  )
);

CREATE POLICY "Admins can manage social media services for their company"
ON public.social_media_services
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
);

-- 7. Update RLS policies for leads_management table
DROP POLICY IF EXISTS "Admins can manage leads_management" ON public.leads_management;
DROP POLICY IF EXISTS "Readonly users can view leads_management" ON public.leads_management;

CREATE POLICY "Staff can view leads management from their company"
ON public.leads_management
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    (public.has_role(auth.uid(), 'readonly') OR public.has_role(auth.uid(), 'admin'))
    AND empresa = public.get_user_company(auth.uid())
  )
);

CREATE POLICY "Admins can manage leads management for their company"
ON public.leads_management
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin')
  OR
  (
    public.has_role(auth.uid(), 'admin')
    AND empresa = public.get_user_company(auth.uid())
  )
);