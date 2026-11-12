alter table public.daily_goals drop constraint daily_goals_user_id_goal_date_key;
alter table public.daily_goals add constraint daily_goals_household_goal_date_key unique (household_id,goal_date);
