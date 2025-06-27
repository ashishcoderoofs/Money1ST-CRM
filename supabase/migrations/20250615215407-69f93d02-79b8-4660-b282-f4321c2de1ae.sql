
-- 1. Create storage bucket for CRM attachments (files, images, etc.)
insert into storage.buckets (id, name, public)
values ('crm-attachments', 'crm-attachments', false)
on conflict do nothing;

-- 2. Allow users to upload, list, and download files they own (authenticated only)
-- Policy: Only allow users access to files where their user_id matches the created_by custom metadata

-- Each object should store "created_by" as the uploading user's ID in the metadata (handled in app).

-- Read access (download/view/list own files)
create policy "Authenticated users can view their own attachments"
on storage.objects
for select
using (
  bucket_id = 'crm-attachments'
  and (storage.objects.metadata->>'created_by') = auth.uid()::text
);

-- Upload access
create policy "Authenticated users can upload attachments"
on storage.objects
for insert
with check (
  bucket_id = 'crm-attachments'
  and (storage.objects.metadata->>'created_by') = auth.uid()::text
);

-- Delete access
create policy "Authenticated users can delete their own attachments"
on storage.objects
for delete
using (
  bucket_id = 'crm-attachments'
  and (storage.objects.metadata->>'created_by') = auth.uid()::text
);

-- List access
create policy "Authenticated users can list their own attachments"
on storage.objects
for select
using (
  bucket_id = 'crm-attachments'
  and (storage.objects.metadata->>'created_by') = auth.uid()::text
);
