
-- Update all sample clients to use your user id as the owner
UPDATE public.clients
SET owner_id = '6cf90929-950a-4432-80df-3b839afb7b05'
WHERE owner_id = '6542279c-7d4d-11eb-9439-0242ac130002';
