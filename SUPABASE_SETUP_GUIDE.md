# Supabase Setup Guide for YouSpace

## Step 1: Create Database Tables

1. Go to your Supabase project: https://dgvwvhxrfgmxxwwodxmn.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase_setup.sql` into the editor
5. Click **Run** to execute the SQL commands

This will create:
- `memories` table with proper indexes
- `generated_stories` table with proper indexes
- Row Level Security (RLS) policies for public access

## Step 2: Create Storage Bucket

1. In your Supabase dashboard, click on **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Configure the bucket:
   - **Name**: `memories`
   - **Public bucket**: Toggle **ON** (we need public access for image URLs)
   - **File size limit**: Set to 5 MB (or your preferred limit)
   - **Allowed MIME types**: Leave empty or specify `image/*`
4. Click **Create bucket**

## Step 3: Configure Storage Policies

After creating the bucket, set up access policies:

1. Click on the `memories` bucket
2. Go to the **Policies** tab
3. Click **New Policy**
4. Create a policy for uploads:
   - **Policy name**: `Allow public uploads`
   - **Allowed operation**: INSERT
   - **Policy definition**: `true` (allows all uploads)
5. Create a policy for downloads:
   - **Policy name**: `Allow public downloads`
   - **Allowed operation**: SELECT
   - **Policy definition**: `true` (allows all downloads)

## Step 4: Verify Setup

Once completed, your app should be able to:
- ✅ Upload photos to Supabase Storage
- ✅ Create memories in the database
- ✅ Fetch memories for any space ID
- ✅ Generate AI stories using OpenAI

## Alternative: Quick Storage Setup via SQL

If you prefer SQL for storage policies, run this in the SQL Editor:

```sql
-- Enable public access to the memories bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload to the memories bucket
CREATE POLICY "Allow public uploads to memories bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memories');

-- Allow anyone to read from the memories bucket
CREATE POLICY "Allow public reads from memories bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'memories');
```

## Testing

After setup, test by:
1. Opening your app at the Replit preview URL
2. Entering a space ID
3. Adding your name and uploading a photo
4. Adding a note and clicking "Add Memory"
5. Generating a story when you have 2+ memories

## Troubleshooting

**Error: "relation public.memories does not exist"**
- Run the SQL commands from `supabase_setup.sql`

**Error: "Failed to upload photo"**
- Make sure the `memories` storage bucket exists and is public
- Check that storage policies allow uploads

**Error: "new row violates row-level security policy"**
- Verify RLS policies are created for both tables
- Make sure policies allow public access (since we removed authentication)

## Need Help?

If you encounter any issues, let me know and I can help troubleshoot!
