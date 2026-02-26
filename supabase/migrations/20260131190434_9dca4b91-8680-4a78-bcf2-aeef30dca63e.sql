-- Create a policy to allow only admins to view guest orders (user_id IS NULL)
CREATE POLICY "Admins can view guest orders"
ON public.orders
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) AND user_id IS NULL
);

-- Also add a policy to allow admins to update guest orders
CREATE POLICY "Admins can update guest orders"
ON public.orders
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) AND user_id IS NULL
);