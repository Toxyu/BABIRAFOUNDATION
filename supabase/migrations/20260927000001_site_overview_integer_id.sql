drop policy if exists "Public can read website overview" on public.site_overview;
drop policy if exists "Authenticated admins can insert website overview" on public.site_overview;
drop policy if exists "Authenticated admins can update website overview" on public.site_overview;
drop policy if exists "Authenticated admins can save website overview" on public.site_overview;

do $$
declare
  overview_id_type text;
begin
  select data_type
    into overview_id_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'site_overview'
      and column_name = 'id';

  if overview_id_type is null then
    raise exception 'public.site_overview.id is missing; apply the CMS schema migration first';
  end if;

  alter table public.site_overview drop constraint if exists site_overview_id_check;

  if overview_id_type in ('text', 'character varying') then
    if exists (select 1 from public.site_overview where id = 'main')
       and exists (select 1 from public.site_overview where id = '1') then
      update public.site_overview as current_row
        set title = legacy_row.title,
            body = legacy_row.body,
            updated_at = legacy_row.updated_at
        from public.site_overview as legacy_row
        where current_row.id = '1'
          and legacy_row.id = 'main';
      delete from public.site_overview where id = 'main';
    else
      update public.site_overview set id = '1' where id = 'main';
    end if;

    alter table public.site_overview
      alter column id type integer using id::integer;
  elsif overview_id_type in ('smallint', 'bigint') then
    alter table public.site_overview
      alter column id type integer using id::integer;
  elsif overview_id_type <> 'integer' then
    raise exception 'Unsupported public.site_overview.id type: %', overview_id_type;
  end if;

  alter table public.site_overview
    add constraint site_overview_id_check check (id = 1);
end;
$$;

grant select on public.site_overview to anon, authenticated;
grant insert, update on public.site_overview to authenticated;

create policy "Public can read website overview"
  on public.site_overview for select
  to anon, authenticated
  using (id = 1);

create policy "Authenticated admins can insert website overview"
  on public.site_overview for insert
  to authenticated
  with check (id = 1);

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