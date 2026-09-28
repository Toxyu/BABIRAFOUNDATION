create table if not exists public.foundation_settings (
  id integer primary key check (id = 1),
  certificate_url text not null check (
    char_length(certificate_url) between 1 and 2048
    and (
      certificate_url ~ '^https://[^[:space:]]+$'
      or certificate_url = '/'
      or certificate_url ~ '^/[^/][^[:space:]]*$'
    )
  ),
  updated_at timestamptz not null default now()
);

alter table public.foundation_settings enable row level security;

grant select on public.foundation_settings to anon, authenticated;
grant insert, update on public.foundation_settings to authenticated;

drop policy if exists "Public can read foundation settings" on public.foundation_settings;
create policy "Public can read foundation settings"
  on public.foundation_settings for select
  to anon, authenticated
  using (id = 1);

drop policy if exists "Authenticated admins can insert foundation settings" on public.foundation_settings;
create policy "Authenticated admins can insert foundation settings"
  on public.foundation_settings for insert
  to authenticated
  with check (id = 1);

drop policy if exists "Authenticated admins can update foundation settings" on public.foundation_settings;
create policy "Authenticated admins can update foundation settings"
  on public.foundation_settings for update
  to authenticated
  using (id = 1)
  with check (id = 1);

insert into public.foundation_settings (id, certificate_url)
values (1, '/api/documents/certificate')
on conflict (id) do nothing;

update storage.buckets
set allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
where id = 'cms-media';
