# Supabase Setup Guide

## Prerequisites
- A Supabase account (sign up at https://supabase.com)

## Step 1: Create a Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the project details and create the project

## Step 2: Run the SQL Migration
1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase_schema.sql` from this repository
3. Paste it into the SQL Editor and click "Run"
4. This will create the following tables:
   - `task_states` - Stores the current state of each task
   - `roster_settings` - Stores custom roster configuration
   - `task_history` - Stores task completion history
   - `roster_history` - Stores roster change history

## Step 3: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Configure the Application
Create a `.env.local` file in the root of the `lab-task-manager-next` directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholder values with your actual credentials from Step 3.

## Step 5: Deploy or Run Locally

### Run Locally
```bash
npm run dev
```

### Deploy to Vercel
1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add the environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Fallback Behavior
If Supabase credentials are not configured, the application will automatically fall back to using `localStorage` for data persistence. This means:
- The app works immediately without any setup
- Data is stored locally in the browser
- Data is not shared across devices or browsers

Once you configure Supabase, all data will be stored in the cloud and accessible from any device.
