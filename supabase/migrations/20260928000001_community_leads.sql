create table if not exists public.community_leads (
  id uuid primary key default gen_random_uuid(),
  contact_info text not null check (char_length(btrim(contact_info)) between 3 and 254),
  region text not null check (char_length(btrim(region)) between 1 and 100),
  consent_given boolean not null check (consent_given),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.community_leads enable row level security;

grant insert on public.community_leads to anon, authenticated;
grant select on public.community_leads to authenticated;

drop policy if exists "Visitors can submit consented community sign-ups" on public.community_leads;
create policy "Visitors can submit consented community sign-ups"
  on public.community_leads for insert
  to anon, authenticated
  with check (consent_given = true);

drop policy if exists "Authenticated admins can read community sign-ups" on public.community_leads;
create policy "Authenticated admins can read community sign-ups"
  on public.community_leads for select
  to authenticated
  using (true);
