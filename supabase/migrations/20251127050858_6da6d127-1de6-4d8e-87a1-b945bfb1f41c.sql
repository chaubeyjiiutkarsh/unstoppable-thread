-- Add INSERT policy for order_items table
-- This allows users to create order items for their own orders
CREATE POLICY "Users can insert items for their own orders"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);