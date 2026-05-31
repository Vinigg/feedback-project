-- Fix every employee Supabase Auth record and set password to 123456.
-- Run the whole script in Supabase > SQL Editor > New query.

do $$
declare
  employee record;
begin
  for employee in
    select
      u.id,
      u.email
    from auth.users u
    inner join public.profiles p on p.id = u.id
    where p.role = 'employee'
  loop
    update auth.users
    set
      encrypted_password = crypt('123456', gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      confirmation_token = coalesce(confirmation_token, ''),
      recovery_token = coalesce(recovery_token, ''),
      email_change = coalesce(email_change, ''),
      email_change_token_new = coalesce(email_change_token_new, ''),
      email_change_token_current = coalesce(email_change_token_current, ''),
      phone_change = coalesce(phone_change, ''),
      phone_change_token = coalesce(phone_change_token, ''),
      reauthentication_token = coalesce(reauthentication_token, ''),
      aud = coalesce(nullif(aud, ''), 'authenticated'),
      role = coalesce(nullif(role, ''), 'authenticated'),
      raw_app_meta_data = coalesce(raw_app_meta_data, '{"provider":"email","providers":["email"]}'::jsonb),
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb),
      updated_at = now()
    where id = employee.id;

    if not exists (
      select 1
      from auth.identities
      where user_id = employee.id
        and provider = 'email'
    ) then
      insert into auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      )
      values (
        gen_random_uuid(),
        employee.id,
        jsonb_build_object('sub', employee.id::text, 'email', employee.email),
        'email',
        employee.id::text,
        now(),
        now(),
        now()
      );
    end if;
  end loop;
end $$;

select
  u.id,
  u.email,
  p.name,
  p.role as profile_role,
  u.email_confirmed_at,
  exists (
    select 1
    from auth.identities i
    where i.user_id = u.id
      and i.provider = 'email'
  ) as has_email_identity,
  u.updated_at
from auth.users u
inner join public.profiles p on p.id = u.id
where p.role = 'employee'
order by p.name;
