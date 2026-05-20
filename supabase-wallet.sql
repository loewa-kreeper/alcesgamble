create extension if not exists pgcrypto with schema extensions;

create table if not exists public.player_accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  balance numeric(12, 2) not null default 0 check (balance >= 0),
  xp integer not null default 0 check (xp >= 0),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint player_accounts_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

comment on table public.player_accounts is
  'Username/password accounts and wallet balances for Alces Gamble. Access is only through RPC functions.';

alter table public.player_accounts
  add column if not exists xp integer not null default 0 check (xp >= 0);

alter table public.player_accounts
  add column if not exists is_public boolean not null default true;

alter table public.player_accounts enable row level security;

revoke all on public.player_accounts from anon, authenticated;

drop function if exists public.create_player_account(text, text);
drop function if exists public.login_player_account(text, text);
drop function if exists public.save_player_wallet(text, text, numeric);
drop function if exists public.save_player_wallet(text, text, numeric, integer);
drop function if exists public.update_player_settings(text, text, text, text, boolean);
drop function if exists public.delete_player_account(text, text);
drop function if exists public.get_public_leaderboards();

create or replace function public.create_player_account(
  p_username text,
  p_password text
)
returns table(account_id uuid, username text, balance numeric, xp integer, is_public boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_username text := lower(trim(p_username));
begin
  if cleaned_username !~ '^[a-z0-9_]{3,20}$' then
    raise exception 'Username must be 3-20 characters using letters, numbers, or underscore.';
  end if;

  if length(p_password) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  return query
    insert into public.player_accounts (username, password_hash)
    values (cleaned_username, extensions.crypt(p_password, extensions.gen_salt('bf')))
    returning id, player_accounts.username, player_accounts.balance, player_accounts.xp, player_accounts.is_public;
exception
  when unique_violation then
    raise exception 'Username is already taken.';
end;
$$;

create or replace function public.login_player_account(
  p_username text,
  p_password text
)
returns table(account_id uuid, username text, balance numeric, xp integer, is_public boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select id, player_accounts.username, player_accounts.balance, player_accounts.xp, player_accounts.is_public
    from public.player_accounts
    where player_accounts.username = lower(trim(p_username))
      and password_hash = extensions.crypt(p_password, password_hash);

  if not found then
    raise exception 'Wrong username or password.';
  end if;
end;
$$;

create or replace function public.update_player_settings(
  p_username text,
  p_password text,
  p_new_username text default null,
  p_new_password text default null,
  p_is_public boolean default null
)
returns table(account_id uuid, username text, balance numeric, xp integer, is_public boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_new_username text := nullif(lower(trim(coalesce(p_new_username, ''))), '');
  cleaned_new_password text := nullif(coalesce(p_new_password, ''), '');
begin
  if cleaned_new_username is not null and cleaned_new_username !~ '^[a-z0-9_]{3,20}$' then
    raise exception 'Username must be 3-20 characters using letters, numbers, or underscore.';
  end if;

  if cleaned_new_password is not null and length(cleaned_new_password) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  return query
    update public.player_accounts
    set
      username = coalesce(cleaned_new_username, player_accounts.username),
      password_hash = case
        when cleaned_new_password is not null then extensions.crypt(cleaned_new_password, extensions.gen_salt('bf'))
        else player_accounts.password_hash
      end,
      is_public = coalesce(p_is_public, player_accounts.is_public),
      updated_at = now()
    where player_accounts.username = lower(trim(p_username))
      and player_accounts.password_hash = extensions.crypt(p_password, player_accounts.password_hash)
    returning player_accounts.id, player_accounts.username, player_accounts.balance, player_accounts.xp, player_accounts.is_public;

  if not found then
    raise exception 'Wrong username or password.';
  end if;
exception
  when unique_violation then
    raise exception 'Username is already taken.';
end;
$$;

create or replace function public.delete_player_account(
  p_username text,
  p_password text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.player_accounts
  where player_accounts.username = lower(trim(p_username))
    and player_accounts.password_hash = extensions.crypt(p_password, player_accounts.password_hash);

  if not found then
    raise exception 'Wrong username or password.';
  end if;
end;
$$;

create or replace function public.get_public_leaderboards()
returns table(username text, balance numeric, xp integer)
language sql
security definer
set search_path = public
as $$
  select player_accounts.username, player_accounts.balance, player_accounts.xp
  from public.player_accounts
  where player_accounts.is_public = true
  order by player_accounts.xp desc, player_accounts.balance desc, player_accounts.username asc
  limit 100;
$$;

create or replace function public.save_player_wallet(
  p_username text,
  p_password text,
  p_balance numeric,
  p_xp integer
)
returns table(balance numeric, xp integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_balance < 0 then
    raise exception 'Wallet cannot be negative.';
  end if;

  if p_xp < 0 then
    raise exception 'XP cannot be negative.';
  end if;

  return query
  update public.player_accounts
  set
    balance = round(p_balance, 2),
    xp = p_xp,
    updated_at = now()
  where username = lower(trim(p_username))
    and password_hash = extensions.crypt(p_password, password_hash)
  returning player_accounts.balance, player_accounts.xp;

  if not found then
    raise exception 'Could not save wallet.';
  end if;
end;
$$;

grant execute on function public.create_player_account(text, text) to anon, authenticated;
grant execute on function public.login_player_account(text, text) to anon, authenticated;
grant execute on function public.save_player_wallet(text, text, numeric, integer) to anon, authenticated;
grant execute on function public.update_player_settings(text, text, text, text, boolean) to anon, authenticated;
grant execute on function public.delete_player_account(text, text) to anon, authenticated;
grant execute on function public.get_public_leaderboards() to anon, authenticated;
