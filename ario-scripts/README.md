# ARIO SCRIPTS

Production-ready Next.js + Supabase starter matching the supplied ARIO SCRIPTS specification.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local`.
3. Fill in Supabase URL and anon key. Keep the service-role key server-only.
4. Run `supabase/migrations/001_initial.sql` in the Supabase SQL Editor.
5. Create the `script-images` Storage bucket and apply the storage policies from the migration.
6. Enable Email/Password authentication in Supabase.
7. Register an account, then promote it to admin with the documented SQL in `supabase/README.md`.
8. `npm run dev`

## Notes
- The included app is a real Supabase-backed application scaffold, not a JSON/local-storage mock.
- Server-side privileged operations use the service-role key only in server code.
- The UI includes public script browsing, auth pages, favorites, reporting, admin routes, script CRUD, categories, users, reports, logs, and settings.
- Replace `public/ario-favicon.svg` with your own logo if desired; the favicon is already wired in `app/layout.tsx`.
