-- Remove auto-creation of public.users on Google OAuth signup
-- Account creation now only happens via claim flow
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
