-- Fix 1: Remove guest order exposure vulnerability
-- Drop the problematic policy that exposes guest orders to all authenticated users
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create a secure policy - users can ONLY view their own orders (not guest orders)
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Fix 2: Require authentication for order creation to prevent spam/fake orders
-- Drop the permissive policy that allows anyone to create orders
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create a policy that requires authentication for order creation
-- Users can create orders for themselves or as guests (user_id = NULL)
CREATE POLICY "Authenticated users can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR user_id IS NULL)
);

-- Fix 3: Add database constraints to prevent abuse
ALTER TABLE public.orders 
ADD CONSTRAINT check_total_reasonable CHECK (total > 0 AND total <= 5000);

ALTER TABLE public.orders 
ADD CONSTRAINT check_items_not_empty CHECK (jsonb_array_length(items) >= 1 AND jsonb_array_length(items) <= 50);