-- Restore the default Supabase grants for the public schema.
-- Run this in Supabase > SQL Editor > New query.
--
-- This fixes errors such as:
-- "permission denied for schema public"
-- "Database error querying schema"

grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant usage on schema public to service_role;
grant usage on schema public to supabase_auth_admin;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all functions in schema public to service_role;

grant select on all tables in schema public to supabase_auth_admin;
grant usage, select on all sequences in schema public to supabase_auth_admin;
grant execute on all functions in schema public to supabase_auth_admin;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;

alter default privileges in schema public
grant all privileges on tables to service_role;

alter default privileges in schema public
grant all privileges on sequences to service_role;

alter default privileges in schema public
grant all privileges on functions to service_role;

alter default privileges in schema public
grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema public
grant usage, select on sequences to authenticated;

alter default privileges in schema public
grant execute on functions to authenticated;

alter default privileges in schema public
grant select on tables to supabase_auth_admin;

alter default privileges in schema public
grant usage, select on sequences to supabase_auth_admin;

alter default privileges in schema public
grant execute on functions to supabase_auth_admin;
