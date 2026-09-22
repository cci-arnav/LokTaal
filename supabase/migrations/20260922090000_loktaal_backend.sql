-- LokTaal backend: Auth profiles, moderated songs, RLS, RPCs and private Storage.
-- Run once in the Supabase SQL editor or with `supabase db push`.

create extension if not exists pgcrypto with schema extensions;

do $$ begin
  create type public.song_status as enum ('draft', 'pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) <= 160),
  avatar_path text check (char_length(avatar_path) <= 500),
  bio text check (char_length(bio) <= 1500),
  state_slug text check (char_length(state_slug) <= 100),
  preferred_language text not null default 'en' check (preferred_language in ('en', 'hi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  artist_name text not null check (char_length(trim(artist_name)) between 1 and 200),
  contributor_name text not null check (char_length(trim(contributor_name)) between 1 and 200),
  contributor_relationship text not null check (char_length(contributor_relationship) between 1 and 100),
  state_slug text not null check (state_slug = any (array[
    'andhra-pradesh','arunachal-pradesh','assam','bihar','chhattisgarh','goa','gujarat','haryana','himachal-pradesh','jharkhand','karnataka','kerala','madhya-pradesh','maharashtra','manipur','meghalaya','mizoram','nagaland','odisha','punjab','rajasthan','sikkim','tamil-nadu','telangana','tripura','uttar-pradesh','uttarakhand','west-bengal','andaman-and-nicobar-islands','chandigarh','dadra-and-nagar-haveli-and-daman-and-diu','delhi','jammu-and-kashmir','ladakh','lakshadweep','puducherry'
  ])),
  district_region text not null check (char_length(trim(district_region)) between 1 and 160),
  language text not null check (char_length(trim(language)) between 1 and 120),
  folk_genre text not null check (char_length(trim(folk_genre)) between 1 and 160),
  instruments text[] not null default '{}',
  recording_year integer check (recording_year between 1850 and extract(year from now())::integer),
  description text not null default '' check (char_length(description) <= 3000),
  cultural_story text not null default '' check (char_length(cultural_story) <= 10000),
  lyrics text check (char_length(lyrics) <= 30000),
  tags text[] not null default '{}',
  audio_path text check (char_length(audio_path) <= 600),
  cover_path text check (char_length(cover_path) <= 600),
  audio_duration_seconds integer check (audio_duration_seconds is null or audio_duration_seconds >= 0),
  rights_confirmed boolean not null default false,
  status public.song_status not null default 'draft',
  rejection_reason text check (char_length(rejection_reason) <= 2000),
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint songs_submission_requirements check (
    status = 'draft' or (rights_confirmed and audio_path is not null and submitted_at is not null)
  ),
  constraint songs_publication_consistency check (
    (status = 'approved' and published_at is not null) or (status <> 'approved' and published_at is null)
  ),
  constraint songs_rejection_consistency check (
    (status = 'rejected' and nullif(trim(rejection_reason), '') is not null) or (status <> 'rejected' and rejection_reason is null)
  )
);

create index if not exists songs_user_status_idx on public.songs (user_id, status, created_at desc);
create index if not exists songs_public_idx on public.songs (status, published_at desc) where status = 'approved';
create index if not exists songs_state_public_idx on public.songs (state_slug, published_at desc) where status = 'approved';
create index if not exists songs_moderation_idx on public.songs (status, submitted_at) where status = 'pending';

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();
drop trigger if exists songs_touch_updated_at on public.songs;
create trigger songs_touch_updated_at before update on public.songs
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, preferred_language)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), case when new.raw_user_meta_data ->> 'preferred_language' in ('en', 'hi') then new.raw_user_meta_data ->> 'preferred_language' else 'en' end)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin(check_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select check_user is not null and check_user = auth.uid() and exists (
    select 1 from public.admins where user_id = check_user
  );
$$;
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

create or replace function public.submit_song(song_id uuid)
returns public.songs language plpgsql security definer set search_path = '' as $$
declare result public.songs;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  update public.songs set status = 'pending', submitted_at = now(), published_at = null, rejection_reason = null
  where id = song_id and user_id = auth.uid() and status in ('draft', 'rejected')
    and rights_confirmed and audio_path is not null
  returning * into result;
  if result.id is null then raise exception 'Song cannot be submitted' using errcode = '42501'; end if;
  return result;
end;
$$;

create or replace function public.approve_song(song_id uuid)
returns public.songs language plpgsql security definer set search_path = '' as $$
declare result public.songs;
begin
  if not public.is_admin(auth.uid()) then raise exception 'Admin access required' using errcode = '42501'; end if;
  update public.songs set status = 'approved', published_at = now(), rejection_reason = null
  where id = song_id and status = 'pending' returning * into result;
  if result.id is null then raise exception 'Pending song not found' using errcode = 'P0002'; end if;
  return result;
end;
$$;

create or replace function public.reject_song(song_id uuid, reason text)
returns public.songs language plpgsql security definer set search_path = '' as $$
declare result public.songs;
begin
  if not public.is_admin(auth.uid()) then raise exception 'Admin access required' using errcode = '42501'; end if;
  if nullif(trim(reason), '') is null then raise exception 'A rejection reason is required' using errcode = '22023'; end if;
  update public.songs set status = 'rejected', rejection_reason = left(trim(reason), 2000), published_at = null
  where id = song_id and status = 'pending' returning * into result;
  if result.id is null then raise exception 'Pending song not found' using errcode = 'P0002'; end if;
  return result;
end;
$$;

revoke all on function public.submit_song(uuid) from public;
revoke all on function public.approve_song(uuid) from public;
revoke all on function public.reject_song(uuid, text) from public;
grant execute on function public.submit_song(uuid) to authenticated;
grant execute on function public.approve_song(uuid) to authenticated;
grant execute on function public.reject_song(uuid, text) to authenticated;

revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.songs enable row level security;

drop policy if exists profiles_read_own_or_public_attribution on public.profiles;
create policy profiles_read_own_or_public_attribution on public.profiles for select
using (id = auth.uid() or public.is_admin(auth.uid()) or exists (
  select 1 from public.songs where songs.user_id = profiles.id and songs.status = 'approved'
));
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists admins_read_self on public.admins;
create policy admins_read_self on public.admins for select using (user_id = auth.uid());

drop policy if exists songs_read_approved_own_or_admin on public.songs;
create policy songs_read_approved_own_or_admin on public.songs for select
using (status = 'approved' or user_id = auth.uid() or public.is_admin(auth.uid()));
drop policy if exists songs_insert_own_draft on public.songs;
create policy songs_insert_own_draft on public.songs for insert
with check (user_id = auth.uid() and status = 'draft' and published_at is null and rejection_reason is null);
drop policy if exists songs_update_own_editable_or_admin on public.songs;
create policy songs_update_own_editable_or_admin on public.songs for update
using ((user_id = auth.uid() and status in ('draft', 'rejected')) or public.is_admin(auth.uid()))
with check ((user_id = auth.uid() and status in ('draft', 'rejected')) or public.is_admin(auth.uid()));
drop policy if exists songs_delete_own_draft_or_admin on public.songs;
create policy songs_delete_own_draft_or_admin on public.songs for delete
using ((user_id = auth.uid() and status = 'draft') or public.is_admin(auth.uid()));

revoke all on public.profiles, public.admins, public.songs from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (full_name, avatar_path, bio, state_slug, preferred_language) on public.profiles to authenticated;
grant select on public.admins to authenticated;
grant select on public.songs to anon, authenticated;
grant insert (id, user_id, title, artist_name, contributor_name, contributor_relationship, state_slug, district_region, language, folk_genre, instruments, recording_year, description, cultural_story, lyrics, tags, audio_path, cover_path, audio_duration_seconds, rights_confirmed) on public.songs to authenticated;
grant update (title, artist_name, contributor_name, contributor_relationship, state_slug, district_region, language, folk_genre, instruments, recording_year, description, cultural_story, lyrics, tags, audio_path, cover_path, audio_duration_seconds, rights_confirmed) on public.songs to authenticated;
grant delete on public.songs to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('song-audio', 'song-audio', false, 26214400, array['audio/mpeg','audio/mp4','audio/x-m4a','audio/m4a']),
  ('song-covers', 'song-covers', false, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists loktaal_storage_read on storage.objects;
create policy loktaal_storage_read on storage.objects for select using (
  bucket_id in ('song-audio', 'song-covers') and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin(auth.uid())
    or exists (select 1 from public.songs where songs.status = 'approved' and (songs.audio_path = storage.objects.name or songs.cover_path = storage.objects.name))
  )
);
drop policy if exists loktaal_storage_insert_own on storage.objects;
create policy loktaal_storage_insert_own on storage.objects for insert to authenticated with check (
  bucket_id in ('song-audio', 'song-covers') and (storage.foldername(name))[1] = auth.uid()::text
);
drop policy if exists loktaal_storage_update_own_unpublished_or_admin on storage.objects;
create policy loktaal_storage_update_own_unpublished_or_admin on storage.objects for update to authenticated
using (bucket_id in ('song-audio', 'song-covers') and (
  public.is_admin(auth.uid()) or ((storage.foldername(name))[1] = auth.uid()::text and not exists (
    select 1 from public.songs where songs.status = 'approved' and (songs.audio_path = storage.objects.name or songs.cover_path = storage.objects.name)
  ))
))
with check (bucket_id in ('song-audio', 'song-covers') and (public.is_admin(auth.uid()) or (storage.foldername(name))[1] = auth.uid()::text));
drop policy if exists loktaal_storage_delete_own_unpublished_or_admin on storage.objects;
create policy loktaal_storage_delete_own_unpublished_or_admin on storage.objects for delete to authenticated using (
  bucket_id in ('song-audio', 'song-covers') and (
    public.is_admin(auth.uid()) or ((storage.foldername(name))[1] = auth.uid()::text and not exists (
      select 1 from public.songs where songs.status = 'approved' and (songs.audio_path = storage.objects.name or songs.cover_path = storage.objects.name)
    ))
  )
);
