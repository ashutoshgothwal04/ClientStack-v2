-- Location: supabase/migrations/20250805164831_user_profile_system.sql
-- User Profile System with Authentication and Storage

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE public.notification_type AS ENUM ('email', 'push', 'in_app');
CREATE TYPE public.theme_preference AS ENUM ('light', 'dark', 'system');
CREATE TYPE public.timezone_region AS ENUM ('UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai');

-- 2. Core User Profiles Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    bio TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    website TEXT,
    location TEXT,
    role public.user_role DEFAULT 'member'::public.user_role,
    subscription_tier public.subscription_tier DEFAULT 'free'::public.subscription_tier,
    profile_photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Preferences Table
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    theme public.theme_preference DEFAULT 'system'::public.theme_preference,
    timezone public.timezone_region DEFAULT 'UTC'::public.timezone_region,
    language TEXT DEFAULT 'en',
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    time_format TEXT DEFAULT '12',
    default_project_view TEXT DEFAULT 'list',
    dashboard_layout JSONB DEFAULT '{"widgets": ["metrics", "recent_activity", "quick_actions"]}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Notification Settings Table
CREATE TABLE public.notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    notification_type public.notification_type NOT NULL,
    project_updates BOOLEAN DEFAULT true,
    invoice_reminders BOOLEAN DEFAULT true,
    payment_confirmations BOOLEAN DEFAULT true,
    security_alerts BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    weekly_digest BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_type)
);

-- 5. User Sessions Table
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    device_info TEXT,
    ip_address INET,
    user_agent TEXT,
    location TEXT,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscription Details Table
CREATE TABLE public.subscription_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tier public.subscription_tier NOT NULL,
    billing_cycle TEXT DEFAULT 'monthly',
    price_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    next_billing_date DATE,
    auto_renewal BOOLEAN DEFAULT true,
    payment_method_id TEXT,
    stripe_subscription_id TEXT,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_notification_settings_user_id ON public.notification_settings(user_id);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_subscription_details_user_id ON public.subscription_details(user_id);

-- 8. Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-images',
    'profile-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- 9. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_details ENABLE ROW LEVEL SECURITY;

-- 10. Helper Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'member'::public.user_role)
  );
  
  -- Create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create default notification settings
  INSERT INTO public.notification_settings (user_id, notification_type, project_updates, invoice_reminders, payment_confirmations, security_alerts, marketing_emails, weekly_digest)
  VALUES 
    (NEW.id, 'email'::public.notification_type, true, true, true, true, false, true),
    (NEW.id, 'push'::public.notification_type, true, false, true, true, false, false),
    (NEW.id, 'in_app'::public.notification_type, true, true, true, true, false, true);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 11. RLS Policies

-- Pattern 1: Core user table - Simple policies only
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership
CREATE POLICY "users_manage_own_preferences"
ON public.user_preferences
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_notifications"
ON public.notification_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_sessions"
ON public.user_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_subscription"
ON public.subscription_details
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Storage RLS Policies
CREATE POLICY "users_view_own_profile_images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid());

CREATE POLICY "users_upload_own_profile_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile-images' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_profile_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'profile-images' AND owner = auth.uid());

CREATE POLICY "users_delete_own_profile_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid());

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON public.notification_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_details_updated_at
    BEFORE UPDATE ON public.subscription_details
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@clientstack.com', crypt('Demo123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@clientstack.com', crypt('Demo123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jane User", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with additional demo data
    UPDATE public.user_profiles 
    SET 
        bio = 'Experienced project manager with 10+ years in client services',
        phone = '+1-555-0123',
        company = 'ClientStack Inc.',
        job_title = 'Senior Project Manager',
        website = 'https://johnsmith.dev',
        location = 'San Francisco, CA',
        subscription_tier = 'pro'::public.subscription_tier,
        email_verified = true,
        last_login_at = CURRENT_TIMESTAMP - INTERVAL '1 hour'
    WHERE id = admin_uuid;

    UPDATE public.user_profiles 
    SET 
        bio = 'Digital marketing specialist focused on client growth',
        phone = '+1-555-0124',
        company = 'Marketing Pro LLC',
        job_title = 'Marketing Specialist',
        location = 'New York, NY',
        subscription_tier = 'free'::public.subscription_tier,
        email_verified = true,
        last_login_at = CURRENT_TIMESTAMP - INTERVAL '30 minutes'
    WHERE id = user_uuid;

    -- Create demo subscription details
    INSERT INTO public.subscription_details (user_id, tier, billing_cycle, price_paid, next_billing_date, payment_method_id)
    VALUES 
        (admin_uuid, 'pro'::public.subscription_tier, 'monthly', 29.99, CURRENT_DATE + INTERVAL '1 month', 'pm_demo123'),
        (user_uuid, 'free'::public.subscription_tier, 'monthly', 0.00, null, null);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;