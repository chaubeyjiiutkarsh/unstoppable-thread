-- =========================
-- EXTENSIONS
-- =========================
create extension if not exists "pgcrypto";

-- =========================
-- PROFILES (users)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public read profiles"
on public.profiles for select
using (true);

create policy "Users insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users update own profile"
on public.profiles for update
using (auth.uid() = id);

-- =========================
-- PRODUCTS
-- =========================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  category text,
  image_url text,
  colors text[],
  sizes text[],
  stock int default 0,
  is_featured boolean default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Public read products"
on public.products for select
using (true);

-- =========================
-- CART ITEMS
-- =========================
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity int not null check (quantity > 0),
  color text,
  size text,
  created_at timestamptz default now()
);

alter table public.cart_items enable row level security;

create policy "Users manage own cart"
on public.cart_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================
-- ADDRESSES
-- =========================
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  is_default boolean default true,
  created_at timestamptz default now()
);

alter table public.addresses enable row level security;

create policy "Users manage own addresses"
on public.addresses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================
-- ORDERS
-- =========================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  address_id uuid references public.addresses(id) on delete set null,
  total_amount numeric not null,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users read own orders"
on public.orders for select
using (auth.uid() = user_id);

create policy "Users insert own orders"
on public.orders for insert
with check (auth.uid() = user_id);

-- =========================
-- ORDER ITEMS
-- =========================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int not null,
  price numeric not null,
  color text,
  size text
);

alter table public.order_items enable row level security;

create policy "Users read own order items"
on public.order_items for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

-- =========================
-- REVIEWS
-- =========================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  review_text text,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Public read reviews"
on public.reviews for select
using (true);

create policy "Users insert reviews"
on public.reviews for insert
with check (auth.uid() = user_id);

-- =========================
-- SEEDS (Seed Lookup)
-- =========================
create table if not exists public.seeds (
  id uuid primary key default gen_random_uuid(),
  seed_number text unique not null,
  name text not null,
  type text,
  description text,
  care_instructions text,
  image_url text
);

alter table public.seeds enable row level security;

create policy "Public read seeds"
on public.seeds for select
using (true);
