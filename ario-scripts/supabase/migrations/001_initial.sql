create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text unique not null,
 email text,
 avatar_url text,
 role text not null default 'user' check (role in ('user','moderator','admin')),
 banned boolean not null default false,
 ban_reason text,
 ban_expires_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.categories (
 id uuid primary key default gen_random_uuid(),
 name text unique not null,
 slug text unique not null,
 description text,
 created_at timestamptz not null default now()
);

create table if not exists public.scripts (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text unique not null,
 game_name text not null,
 category_id uuid references public.categories(id) on delete set null,
 short_description text,
 description text,
 code text not null,
 image_url text,
 showcase_video_url text,
 download_enabled boolean not null default true,
 status text not null default 'published' check (status in ('draft','published','archived')),
 featured boolean not null default false,
 copy_count integer not null default 0 check (copy_count >= 0),
 download_count integer not null default 0 check (download_count >= 0),
 tags text[],
 created_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 script_id uuid not null references public.scripts(id) on delete cascade,
 created_at timestamptz not null default now(),
 unique(user_id,script_id)
);

create table if not exists public.reports (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 script_id uuid not null references public.scripts(id) on delete cascade,
 reason text not null,
 description text,
 status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.admin_logs (
 id uuid primary key default gen_random_uuid(),
 admin_id uuid references public.profiles(id) on delete set null,
 action text not null,
 target_type text,
 target_id uuid,
 metadata jsonb,
 created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
 id uuid primary key default gen_random_uuid(),
 site_name text not null default 'ARIO SCRIPTS',
 site_description text,
 logo_url text,
 discord_url text,
 support_url text,
 maintenance_mode boolean not null default false,
 registration_enabled boolean not null default true,
 updated_at timestamptz not null default now()
);

create index if not exists scripts_title_idx on public.scripts(title);
create index if not exists scripts_slug_idx on public.scripts(slug);
create index if not exists scripts_game_idx on public.scripts(game_name);
create index if not exists scripts_category_idx on public.scripts(category_id);
create index if not exists scripts_status_idx on public.scripts(status);
create index if not exists scripts_featured_idx on public.scripts(featured);
create index if not exists scripts_created_idx on public.scripts(created_at desc);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_banned_idx on public.profiles(banned);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
 insert into public.profiles(id,username,email)
 values (new.id, coalesce(nullif(new.raw_user_meta_data->>'username',''), split_part(new.email,'@',1)), new.email)
 on conflict (id) do nothing;
 return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.increment_script_copy_count(p_script_id uuid)
returns void language sql security definer set search_path = public as $$
 update public.scripts set copy_count=copy_count+1,updated_at=now() where id=p_script_id and status='published';
$$;

create or replace function public.increment_script_download_count(p_script_id uuid)
returns void language sql security definer set search_path = public as $$
 update public.scripts set download_count=download_count+1,updated_at=now() where id=p_script_id and status='published' and download_enabled=true;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.scripts enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.admin_logs enable row level security;
alter table public.site_settings enable row level security;

create policy "published scripts readable" on public.scripts for select using (status='published' or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "categories readable" on public.categories for select using (true);
create policy "own favorites readable" on public.favorites for select using (auth.uid()=user_id);
create policy "own favorites insert" on public.favorites for insert with check (auth.uid()=user_id);
create policy "own favorites delete" on public.favorites for delete using (auth.uid()=user_id);
create policy "reports insert" on public.reports for insert with check (auth.uid()=user_id);
create policy "own reports readable" on public.reports for select using (auth.uid()=user_id or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('moderator','admin')));
create policy "public settings readable" on public.site_settings for select using (true);
create policy "own profile readable" on public.profiles for select using (auth.uid()=id or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('moderator','admin')));

create policy "admin scripts manage" on public.scripts for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin categories manage" on public.categories for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin settings manage" on public.site_settings for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin logs readable" on public.admin_logs for select using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin logs insert" on public.admin_logs for insert with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

insert into public.site_settings(site_name,site_description) select 'ARIO SCRIPTS','Discover powerful scripts.' where not exists(select 1 from public.site_settings);
insert into public.categories(name,slug,description) values
('Universal','universal','General scripts'),
('Utilities','utilities','Utility scripts')
on conflict do nothing;

insert into storage.buckets(id,name,public) values ('script-images','script-images',true) on conflict do nothing;

create policy "public read script images" on storage.objects for select using (bucket_id='script-images');
create policy "admin upload script images" on storage.objects for insert with check (bucket_id='script-images' and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin update script images" on storage.objects for update using (bucket_id='script-images' and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admin delete script images" on storage.objects for delete using (bucket_id='script-images' and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
