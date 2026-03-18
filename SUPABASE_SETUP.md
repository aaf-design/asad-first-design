# Supabase Setup Guide

Follow these steps to set up your Supabase project for the Design Hub.

## 1. Create a Project
1. Go to [Supabase Console](https://app.supabase.com/) and create a new project.
2. Get your `URL` and `Anon Key` from **Project Settings > API**.

## 2. Database Schema
Run the following SQL in the **SQL Editor** of your Supabase dashboard:

```sql
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

-- 2. Authenticated users can insert their own designs
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
```

## 3. Storage Setup
1. Go to **Storage** in the Supabase dashboard.
2. Create a new bucket named `designs`.
3. Set the bucket to **Public**.
4. Add the following policies for the `designs` bucket:
   - **Select**: Anyone (All)
   - **Insert**: Authenticated users only
   - **Update/Delete**: Owners only (authenticated users)

## 4. Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Admin Credentials
The admin is hardcoded in `src/lib/constants.ts`:
- **Email**: `aaflogiccreator@gmail.com`
- **Password**: `logic1021` (Set this when creating the user in Supabase Auth)

## 6. Accessing Admin Panel
1. Go to the home page.
2. Press `Shift + 5` on your keyboard.
3. The "Admin Login" button will appear in the navigation bar.
4. Log in with the admin credentials above to access the `/upload` page.
