-- Create designs table
create table designs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text not null,
  user_id uuid references auth.users not null
);

-- Enable Row Level Security
alter table designs enable row level security;

-- Create Policies
-- 1. Anyone can view designs
create policy "Anyone can view designs"
on designs for select
using ( true );

-- 2. Authenticated users can insert their own designs (but we'll restrict this in the app logic to admin only)
create policy "Users can insert their own designs"
on designs for insert
with check ( auth.uid() = user_id );

-- 3. Users can update their own designs
create policy "Users can update their own designs"
on designs for update
using ( auth.uid() = user_id );

-- 4. Users can delete their own designs
create policy "Users can delete their own designs"
on designs for delete
using ( auth.uid() = user_id );
