create extension if not exists pgcrypto;

create table if not exists public.player_accounts (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  balance numeric(12, 2) not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint player_accounts_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

comment on table public.player_accounts is
  'Username/password accounts and wallet balances for Alces Gamble. Access is only through RPC functions.';

alter table public.player_accounts enable row level security;

revoke all on public.player_accounts from anon, authenticated;

create or replace function public.create_player_account(
  p_username text,
  p_password text
)
returns table(account_id uuid, username text, balance numeric)
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
    values (cleaned_username, crypt(p_password, gen_salt('bf')))
    returning id, player_accounts.username, player_accounts.balance;
exception
  when unique_violation then
    raise exception 'Username is already taken.';
end;
$$;

create or replace function public.login_player_account(
  p_username text,
  p_password text
)
returns table(account_id uuid, username text, balance numeric)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select id, player_accounts.username, player_accounts.balance
    from public.player_accounts
    where player_accounts.username = lower(trim(p_username))
      and password_hash = crypt(p_password, password_hash);

  if not found then
    raise exception 'Wrong username or password.';
  end if;
end;
$$;

create or replace function public.save_player_wallet(
  p_username text,
  p_password text,
  p_balance numeric
)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_balance numeric;
begin
  if p_balance < 0 then
    raise exception 'Wallet cannot be negative.';
  end if;

  update public.player_accounts
  set
    balance = round(p_balance, 2),
    updated_at = now()
  where username = lower(trim(p_username))
    and password_hash = crypt(p_password, password_hash)
  returning balance into saved_balance;

  if saved_balance is null then
    raise exception 'Could not save wallet.';
  end if;

  return saved_balance;
end;
$$;

grant execute on function public.create_player_account(text, text) to anon, authenticated;
grant execute on function public.login_player_account(text, text) to anon, authenticated;
grant execute on function public.save_player_wallet(text, text, numeric) to anon, authenticated;
