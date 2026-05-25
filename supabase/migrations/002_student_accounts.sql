-- Run if you already created tables from an older schema.sql (adds student accounts support)

alter table public.students
  add column if not exists user_id uuid unique references auth.users(id) on delete cascade;

alter table public.profiles
  add column if not exists matric text,
  add column if not exists course text,
  add column if not exists student_id bigint references public.students(id) on delete set null;

-- Optional: remove demo seed students (only rows without a linked account)
delete from public.students where user_id is null;

drop policy if exists "Auth users read all profiles" on public.profiles;
create policy "Auth users read all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_student_id bigint;
  user_role text;
  user_matric text;
  user_course text;
  user_name text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'teacher');
  user_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  user_matric := new.raw_user_meta_data->>'matric';
  user_course := coalesce(new.raw_user_meta_data->>'course', 'Computer Science');

  insert into public.profiles (id, full_name, role, matric, course)
  values (new.id, user_name, user_role, user_matric, user_course);

  if user_role = 'student' and user_matric is not null and length(trim(user_matric)) > 0 then
    insert into public.students (user_id, name, matric, course, email)
    values (new.id, user_name, trim(user_matric), user_course, new.email)
    returning id into new_student_id;

    update public.profiles
    set student_id = new_student_id
    where id = new.id;
  end if;

  return new;
end;
$$;
