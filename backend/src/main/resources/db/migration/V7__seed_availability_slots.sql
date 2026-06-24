INSERT INTO availability_slots (id, doctor_id, day_of_week, start_time, end_time, is_active)
SELECT
    gen_random_uuid(),
    d.id,
    days.day,
    slots.start_time::time,
    (slots.start_time::time + interval '30 minutes'),
    true
FROM doctor_profiles d
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS days(day)
CROSS JOIN (
    VALUES
    ('09:00'), ('09:30'), ('10:00'), ('10:30'),
    ('11:00'), ('11:30'), ('12:00'), ('12:30'),
    ('13:00'), ('13:30'), ('14:00'), ('14:30'),
    ('15:00'), ('15:30'), ('16:00'), ('16:30')
) AS slots(start_time);