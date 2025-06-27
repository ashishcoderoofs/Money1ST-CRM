
-- Insert sample/dummy client entries for demo/testing
INSERT INTO public.clients (
  applicant,
  co_applicant,
  consultant_name,
  processor_name,
  total_debt,
  status,
  owner_id
)
VALUES
  ('Edward Cullen', 'Bella Swan', 'Jacob Black', 'Carlisle Cullen', 82500, 'Open', '6542279c-7d4d-11eb-9439-0242ac130002'),
  ('Tony Stark', NULL, 'Pepper Potts', 'Happy Hogan', 132000, 'Closed', '6542279c-7d4d-11eb-9439-0242ac130002'),
  ('Bruce Wayne', 'Selina Kyle', 'Alfred Pennyworth', 'Lucius Fox', 56000, 'Open', '6542279c-7d4d-11eb-9439-0242ac130002'),
  ('Clark Kent', 'Lois Lane', 'Perry White', 'Jimmy Olsen', 43000, 'Open', '6542279c-7d4d-11eb-9439-0242ac130002'),
  ('Peter Parker', 'Mary Jane', 'Aunt May', NULL, 32000, 'Closed', '6542279c-7d4d-11eb-9439-0242ac130002'),
  ('Diana Prince', NULL, NULL, NULL, 85000, 'Open', '6542279c-7d4d-11eb-9439-0242ac130002');
