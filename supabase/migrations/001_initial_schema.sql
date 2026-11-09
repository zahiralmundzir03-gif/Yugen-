-- YUGEN NEXUS CLOUD DATABASE
-- Jalankan sekali melalui Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null,
  role text not null default 'basic' check (role in ('basic','vip','owner','developers')),
  email_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  last_login timestamptz
);
create unique index if not exists profiles_username_lower_uidx on public.profiles (lower(username));
create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, username, email, role, email_confirmed)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), split_part(new.email, '@', 1)),
    lower(new.email),
    'basic',
    new.email_confirmed_at is not null
  )
  on conflict (id) do update set
    email = excluded.email,
    email_confirmed = excluded.email_confirmed;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_yugen on auth.users;
create trigger on_auth_user_created_yugen
after insert or update of email, email_confirmed_at on auth.users
for each row execute procedure public.handle_new_auth_user();

create or replace function public.is_yugen_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role in ('owner','developers')
  );
$$;

alter table public.profiles enable row level security;
grant select on public.profiles to authenticated;
drop policy if exists "profile_read_self_or_admin" on public.profiles;
create policy "profile_read_self_or_admin" on public.profiles
for select to authenticated
using (id = (select auth.uid()) or public.is_yugen_admin());

-- Profile tidak dapat diubah langsung oleh browser. Operasi sensitif lewat RPC.
drop policy if exists "profile_update_self" on public.profiles;

create or replace function public.is_username_available(candidate_username text)
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (
    select 1 from public.profiles p
    where lower(p.username) = lower(trim(candidate_username))
  );
$$;
revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;

create or replace function public.touch_last_login()
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set last_login = now() where id = (select auth.uid());
end;
$$;
grant execute on function public.touch_last_login() to authenticated;

create or replace function public.admin_set_user_role(target_username text, new_role text)
returns public.profiles language plpgsql security definer set search_path = '' as $$
declare result public.profiles;
begin
  if not public.is_yugen_admin() then raise exception 'Akses ditolak.' using errcode = '42501'; end if;
  if new_role not in ('basic','vip','owner','developers') then raise exception 'Role tidak valid.'; end if;
  update public.profiles set role = new_role
  where lower(username) = lower(trim(target_username))
  returning * into result;
  if result.id is null then raise exception 'User tidak ditemukan.'; end if;
  return result;
end;
$$;
revoke all on function public.admin_set_user_role(text,text) from public;
grant execute on function public.admin_set_user_role(text,text) to authenticated;

create or replace function public.admin_delete_user(target_username text)
returns void language plpgsql security definer set search_path = '' as $$
declare target_id uuid;
begin
  if not public.is_yugen_admin() then raise exception 'Akses ditolak.' using errcode = '42501'; end if;
  select id into target_id from public.profiles where lower(username)=lower(trim(target_username));
  if target_id is null then raise exception 'User tidak ditemukan.'; end if;
  if target_id = (select auth.uid()) then raise exception 'Tidak dapat menghapus akun sendiri.'; end if;
  delete from auth.users where id = target_id;
end;
$$;
revoke all on function public.admin_delete_user(text) from public;
grant execute on function public.admin_delete_user(text) to authenticated;

-- Aktifkan realtime untuk tabel profil.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end $$;
