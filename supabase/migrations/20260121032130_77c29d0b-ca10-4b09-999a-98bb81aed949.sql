-- Fix: Protect guest orders from being accessed by regular authenticated users
-- Drop the current policy that may expose guest orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create a secure policy:
-- 1. Regular users can ONLY see their own orders (user_id must match AND not be null)
-- 2. Guest orders (user_id IS NULL) are NOT visible to regular users
-- 3. Admins can see all orders via the separate admin policy
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND auth.uid() = user_id
);