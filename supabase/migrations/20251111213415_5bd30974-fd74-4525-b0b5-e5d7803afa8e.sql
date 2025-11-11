-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  colors TEXT[] DEFAULT ARRAY['Black', 'White', 'Blue'],
  stock INTEGER DEFAULT 100,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address_id UUID REFERENCES public.addresses(id) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom design requests table
CREATE TABLE public.custom_design_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seeds information table
CREATE TABLE public.seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_number TEXT UNIQUE NOT NULL,
  plant_name TEXT NOT NULL,
  plant_type TEXT NOT NULL,
  description TEXT NOT NULL,
  care_instructions TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP verification table
CREATE TABLE public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_design_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into their own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for addresses
CREATE POLICY "Users can view their own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items 
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- RLS Policies for custom design requests
CREATE POLICY "Users can view their own design requests" ON public.custom_design_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own design requests" ON public.custom_design_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for seeds (public read)
CREATE POLICY "Anyone can view seeds information" ON public.seeds FOR SELECT USING (true);

-- RLS Policies for OTP verifications (public access for signup flow)
CREATE POLICY "Anyone can insert OTP verifications" ON public.otp_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their own OTP verifications" ON public.otp_verifications FOR SELECT USING (true);
CREATE POLICY "Anyone can update OTP verifications" ON public.otp_verifications FOR UPDATE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, category, image_url, features, is_featured) VALUES
  ('Adaptive Comfort Shirt', 'Premium cotton shirt with magnetic closures for easy dressing. Perfect for individuals with limited mobility.', 1499.00, 'Shirts', NULL, '["Magnetic closures", "100% premium cotton", "Adjustable hem", "Machine washable"]', true),
  ('Smart Comfort Tee', 'Temperature-responsive t-shirt that adapts to your comfort needs throughout the day.', 999.00, 'T-Shirts', NULL, '["Temperature adaptive", "Soft fabric", "Magnetic closures", "Eco-friendly dye"]', true),
  ('Adjustable Hem Pants', 'Comfortable pants with elastic adjustable hem for perfect fit across different body types.', 1799.00, 'Pants', NULL, '["Adjustable hem", "Elastic waistband", "Multiple pockets", "Durable fabric"]', false),
  ('Easy-Wear Jacket', 'Stylish jacket with magnetic zipper closure and adjustable features for maximum comfort.', 2499.00, 'Jackets', NULL, '["Magnetic zipper", "Water-resistant", "Multiple pockets", "Adjustable cuffs"]', true),
  ('Comfort Shorts', 'Breathable shorts with easy-to-use elastic waistband and adjustable length.', 899.00, 'Shorts', NULL, '["Elastic waistband", "Adjustable length", "Lightweight fabric", "Quick-dry"]', false),
  ('Adaptive Dress', 'Elegant dress with side magnetic closures for easy wearing while maintaining style.', 2199.00, 'Dresses', NULL, '["Side magnetic closures", "Soft fabric", "Adjustable fit", "Elegant design"]', false);

-- Insert sample seeds information
INSERT INTO public.seeds (seed_number, plant_name, plant_type, description, care_instructions) VALUES
  ('UT001', 'Tulsi (Holy Basil)', 'Herb', 'Sacred plant with medicinal properties, known for its aromatic leaves and health benefits.', 'Water regularly, keep in sunlight, harvest leaves as needed. Grows well in small pots.'),
  ('UT002', 'Marigold', 'Flower', 'Bright orange-yellow flowers that symbolize positivity and are commonly used in celebrations.', 'Water daily, needs 6-8 hours of sunlight. Blooms in 8-10 weeks. Deadhead spent flowers.'),
  ('UT003', 'Coriander', 'Herb', 'Popular culinary herb with fresh, citrusy flavor used in many Indian dishes.', 'Keep soil moist, partial sunlight preferred. Ready to harvest in 3-4 weeks. Sow new seeds every 2 weeks.'),
  ('UT004', 'Tomato', 'Vegetable', 'Cherry tomato variety perfect for small spaces, producing sweet and juicy fruits.', 'Water regularly, needs full sunlight. Stake the plant as it grows. Fruits ready in 60-80 days.'),
  ('UT005', 'Mint', 'Herb', 'Fast-growing aromatic herb perfect for teas, drinks, and culinary uses.', 'Keep soil consistently moist, grows in partial shade. Prune regularly to encourage bushy growth.');