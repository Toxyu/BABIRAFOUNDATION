insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.website_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('logo', 'background', 'video')),
  file_url text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

alter table public.website_assets enable row level security;

grant select on public.website_assets to anon, authenticated;
grant insert on public.website_assets to authenticated;

drop policy if exists "Public can read website assets" on public.website_assets;
create policy "Public can read website assets"
  on public.website_assets for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated admins can publish website assets" on public.website_assets;
create policy "Authenticated admins can publish website assets"
  on public.website_assets for insert
  to authenticated
  with check (asset_type in ('logo', 'background', 'video'));

create table if not exists public.site_overview (
  id integer primary key check (id = 1),
  title text not null check (char_length(title) between 1 and 180),
  body text not null check (char_length(body) between 1 and 4000),
  updated_at timestamptz not null default now()
);

alter table public.site_overview enable row level security;

grant select on public.site_overview to anon, authenticated;
grant insert, update on public.site_overview to authenticated;

drop policy if exists "Public can read website overview" on public.site_overview;
create policy "Public can read website overview"
  on public.site_overview for select
  to anon, authenticated
  using (id = 1);

drop policy if exists "Authenticated admins can insert website overview" on public.site_overview;
create policy "Authenticated admins can insert website overview"
  on public.site_overview for insert
  to authenticated
  with check (id = 1);

drop policy if exists "Authenticated admins can update website overview" on public.site_overview;
create policy "Authenticated admins can update website overview"
  on public.site_overview for update
  to authenticated
  using (id = 1)
  with check (id = 1);

insert into public.site_overview (id, title, body)
values (
  1,
  'Opportunity grows when a community grows together.',
  'Babira Foundation is a community-focused non-profit organization committed to improving the lives and opportunities of young people and vulnerable members of communities in Vihiga County, Kenya.'
)
on conflict (id) do nothing;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  excerpt text not null check (char_length(excerpt) between 1 and 400),
  body text not null check (char_length(body) between 1 and 12000),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

grant select on public.blog_posts to anon, authenticated;
grant insert, update on public.blog_posts to authenticated;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts for select
  to anon
  using (published = true);

drop policy if exists "Authenticated admins can read all blog posts" on public.blog_posts;
create policy "Authenticated admins can read all blog posts"
  on public.blog_posts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated admins can create blog posts" on public.blog_posts;
create policy "Authenticated admins can create blog posts"
  on public.blog_posts for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated admins can update blog posts" on public.blog_posts;
create policy "Authenticated admins can update blog posts"
  on public.blog_posts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated admins can upload cms media" on storage.objects;
create policy "Authenticated admins can upload cms media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-media');

drop policy if exists "Authenticated admins can remove unregistered cms media" on storage.objects;
create policy "Authenticated admins can remove unregistered cms media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-media');