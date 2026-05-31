-- Allow questions to target a role name from project_members.role_in_project.
-- Run once in Supabase > SQL Editor if the app cannot save a specific role.

alter table public.questions
add column if not exists role_name text;
