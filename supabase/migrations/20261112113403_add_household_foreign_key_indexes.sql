create index if not exists application_events_household_idx on public.application_events(household_id);
create index if not exists daily_goals_user_idx on public.daily_goals(user_id);
create index if not exists household_members_user_idx on public.household_members(user_id);
create index if not exists learning_progress_user_idx on public.learning_progress(user_id);
