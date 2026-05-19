create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance numeric(12, 2) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

alter table public.wallets enable row level security;

drop policy if exists "Users can read their wallet" on public.wallets;
create policy "Users can read their wallet"
  on public.wallets
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their wallet" on public.wallets;
create policy "Users can create their wallet"
  on public.wallets
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their wallet" on public.wallets;
create policy "Users can update their wallet"
  on public.wallets
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
