# Placement HQ — Expo Android + Mac Web MVP

A working starter for a private, cloud-synced DSA, system-design, recruiter, and application tracker. Android native UI and Mac browser use the **same Expo codebase**.

## Included
- Supabase email/password auth, cloud CRUD, and per-user row-level security
- DSA attempts and independently-solved accuracy
- Babua DSA verified Day 0–11 lesson links, watch and notes actions
- Alex Xu / liquidslr 28-chapter curriculum and System Design Primer link
- Job application log and recruiter phone book, Android contact picker
- LeetCode/NeetCode profile-link entry (session-only)
- Responsive Expo Web UI

## Not yet implemented
- Gmail OAuth and inbox classification; requires a Google Cloud OAuth app, verified scopes, server-side token handling
- Automatic LeetCode/NeetCode history sync; needs supported endpoints and account permissions
- Full Babua sheet ingestion, offline write queue, PWA service worker/install validation, notifications, recruiter follow-up scheduler
- Native APK and hosted web deployment; no build credentials or dedicated Supabase project configured
- Dedicated schema for per-attempt timings, companies, interview stages, and revision scheduling

## Run
1. `npm install`
2. Create a **new** Supabase project; run `supabase/schema.sql` in its SQL editor.
3. Copy `.env.example` to `.env` and set the project URL and **publishable** key. Never put service role keys in the app.
4. `npx expo start --web` for Mac browser; `npx expo start --android` for OnePlus (Expo Go / compatible development build).
5. Sign up, confirm email if required, and sign in on both devices.
6. For web production export: `npx expo export --platform web` and deploy `dist/` to a static host with HTTPS.

The course data is a link catalog, not copyrighted book content. The repository's checkmarks do not imply your personal completion.
