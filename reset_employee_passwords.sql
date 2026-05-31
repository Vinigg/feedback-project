-- Fix Carlos' Supabase Auth record and set password to 123456.
-- Run the whole script in Supabase > SQL Editor > New query.

do $$
declare
  target_user_id uuid;
  target_email text := 'carlos.mendes@empresa.com';
begin
  select id
  into target_user_id
  from auth.users
  where lower(email) = lower(target_email);

  if target_user_id is null then
    raise exception 'User % was not found in auth.users', target_email;
  end if;

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
  where id = target_user_id;

  if not exists (
    select 1
    from auth.identities
    where user_id = target_user_id
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
      target_user_id,
      jsonb_build_object('sub', target_user_id::text, 'email', target_email),
      'email',
      target_user_id::text,
      now(),
      now(),
      now()
    );
  end if;
end $$;

select
  u.id,
  u.email,
  u.aud,
  u.role,
  u.email_confirmed_at,
  u.confirmation_token is null as confirmation_token_is_null,
  u.email_change is null as email_change_is_null,
  u.email_change_token_new is null as email_change_token_new_is_null,
  u.recovery_token is null as recovery_token_is_null,
  exists (
    select 1
    from auth.identities i
    where i.user_id = u.id
      and i.provider = 'email'
  ) as has_email_identity,
  u.updated_at
from auth.users u
where lower(u.email) = lower('carlos.mendes@empresa.com');
