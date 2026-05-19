create extension if not exists pgcrypto with schema extensions;

create table if not exists public.player_accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  balance numeric(12, 2) not null default 0 check (balance >= 0),
  xp integer not null default 0 check (xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint player_accounts_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

comment on table public.player_accounts is
  'Username/password accounts and wallet balances for Alces Gamble. Access is only through RPC functions.';

alter table public.player_accounts
  add column if not exists xp integer not null default 0 check (xp >= 0);

alter table public.player_accounts enable row level security;

revoke all on public.player_accounts from anon, authenticated;

drop function if exists public.create_player_account(text, text);
drop function if exists public.login_player_account(text, text);
drop function if exists public.save_player_wallet(text, text, numeric);
drop function if exists public.save_player_wallet(text, text, numeric, integer);

create or replace function public.create_player_account(
  p_username text,
  p_password text
)
returns table(account_id uuid, username text, balance numeric, xp integer)
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
    returning id, player_accounts.username, player_accounts.balance, player_accounts.xp;
exception
  when unique_violation then
    raise exception 'Username is already taken.';
end;
$$;

create or replace function public.login_player_account(
  p_username text,
  p_password text
)
returns table(account_id uuid, username text, balance numeric, xp integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select id, player_accounts.username, player_accounts.balance, player_accounts.xp
    from public.player_accounts
    where player_accounts.username = lower(trim(p_username))
      and password_hash = extensions.crypt(p_password, password_hash);

  if not found then
    raise exception 'Wrong username or password.';
  end if;
end;
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
