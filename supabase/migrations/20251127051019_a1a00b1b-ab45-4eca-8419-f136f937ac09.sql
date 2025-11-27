-- Remove the insecure otp_verifications table
-- This table exposed all OTP codes to anyone and is redundant
-- since Supabase Auth already handles OTP verification internally
DROP TABLE IF EXISTS public.otp_verifications CASCADE;