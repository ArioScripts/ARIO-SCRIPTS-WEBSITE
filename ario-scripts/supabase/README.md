# Supabase setup

Run `migrations/001_initial.sql` in the Supabase SQL Editor.

After registering the first account, promote it securely in the SQL editor:
`update public.profiles set role = 'admin' where email = 'YOUR_EMAIL';`

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

For a production deployment, review and tighten all policies to match your exact moderator/admin workflow.
