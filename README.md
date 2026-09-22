# LokTaal / लोकताल

LokTaal is a bilingual React archive for discovering, contributing, reviewing, and publishing permission-aware Indian folk recordings. Supabase provides authentication, PostgreSQL data, Row Level Security (RLS), RPC status transitions, and private audio/cover storage.

## Local setup

Requirements: Node.js 22 or newer, npm, and a Supabase project created specifically for LokTaal.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. In Supabase **Project Settings → API**, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The legacy anon key variable is supported only as a fallback.
4. Apply `supabase/migrations/20260922090000_loktaal_backend.sql` in the Supabase SQL editor, or run `supabase db push` from a linked Supabase CLI project.
5. In Supabase **Authentication → URL Configuration**, add your local URL (normally `http://localhost:5173`) and production origin. Add both `/auth/callback` and `/reset-password` forms as allowed redirect URLs.
6. Start the site with `npm run dev`.

Never put a service-role key, database password, or other secret in a `VITE_` variable. Vite variables are embedded in the browser bundle. `.env.local` and environment-specific local files are ignored by Git.

## Database, RLS, and Storage

The migration creates:

- `profiles`, populated from new Auth users by a trigger;
- `admins`, a server-authoritative allow-list;
- `songs`, with `draft → pending → approved/rejected` moderation states;
- `submit_song`, `approve_song`, `reject_song`, and `is_admin` RPCs;
- private `song-audio` and `song-covers` buckets with type and size limits;
- RLS and Storage policies for ownership, moderation, and approved public playback.

Contributor browser code cannot directly change status, ownership, publication timestamps, or rejection reasons. Those transitions go through security-definer RPCs that validate the current user and current status. Files are stored below `<auth-user-id>/<song-id>/...`; approved objects can be read through short-lived signed URLs, while unapproved objects remain owner/admin-only.

To grant moderation access, first create the person through Supabase Auth and then, from the SQL editor using a trusted administrator context, run:

```sql
insert into public.admins (user_id)
values ('AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

Do not expose this operation in client code. Sign out and back in after changing an admin grant so the UI refreshes its authorization state.

## Auth and application routes

- `/login`, `/signup`, `/auth/callback`, `/reset-password`
- `/upload` and `/my-submissions` require a valid session
- `/admin/submissions` requires both a session and an `admins` row
- approved songs are merged into search, state pages, and the homepage archive; bundled synthetic demo tracks remain an explicit fallback

Email confirmation and password-reset links use the current site origin, so every deployed origin must be allow-listed in Supabase Auth.

## Verification

Run the full local verification suite:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

For backend acceptance testing, use separate contributor and admin accounts. Confirm that anonymous users see only approved rows, contributors cannot read or alter another contributor’s pending files/rows, contributors cannot self-approve, approved submissions cannot be edited, and only an allow-listed admin can approve or reject. Also test an interrupted upload and confirm that pre-row partial objects are removed.

The public site intentionally remains usable when Supabase environment variables are absent: demo content renders and auth actions show a configuration notice. Live authentication, upload, RLS, RPC, and Storage verification requires a configured Supabase project and the migration above.
