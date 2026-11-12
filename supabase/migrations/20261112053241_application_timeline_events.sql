create table public.application_events (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  event_type text not null check (event_type in ('applied','hr_replied','oa','interview','feedback','offer','rejected','note')),
  occurred_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);
create index application_events_application_time_idx on public.application_events(application_id,occurred_at desc);
alter table public.application_events enable row level security;
create policy "household application events" on public.application_events for all to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
grant select,insert,update,delete on public.application_events to authenticated;
alter publication supabase_realtime add table public.application_events;
