-- Ensure the personal demo accounts referenced by this migration exist in a fresh Docker database.
-- The original seed data expected these rows to already exist locally, which breaks Flyway
-- on a clean PostgreSQL volume because availability_slots/appointments have FK constraints.
INSERT INTO users (id, email, password_hash, role, first_name, last_name, email_verified, created_at)
VALUES
    ('d98ff004-e9b3-4738-bb9e-3d7e8273f707', 'demo.patient@medconnect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Demo', 'Patient', true, NOW()),
    ('06ffed1b-6acf-44d5-9ecf-1ca878f64b5a', 'dr.riste.petkov@medconnect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'DOCTOR', 'Riste', 'Petkov', true, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO doctor_profiles (id, user_id, specialty, bio, languages, timezone, years_experience, profile_photo_url)
VALUES
    ('df36e6d0-9c25-4c4b-b34c-73add78ee6cb', '06ffed1b-6acf-44d5-9ecf-1ca878f64b5a', 'General Practice', 'General practitioner seeded for demo appointments and reviews.', ARRAY['Macedonian', 'English'], 'Europe/Skopje', 8, null)
ON CONFLICT DO NOTHING;

INSERT INTO availability_slots (id, doctor_id, day_of_week, start_time, end_time, is_active)
SELECT
    gen_random_uuid(),
    'df36e6d0-9c25-4c4b-b34c-73add78ee6cb',
    days.day,
    slots.start_time::time,
    (slots.start_time::time + interval '30 minutes'),
    true
FROM (VALUES (1), (2), (3), (4), (5)) AS days(day)
         CROSS JOIN (
    VALUES
        ('09:00'), ('09:30'), ('10:00'), ('10:30'),
        ('11:00'), ('11:30'), ('12:00'), ('12:30'),
        ('13:00'), ('13:30'), ('14:00'), ('14:30'),
        ('15:00'), ('15:30'), ('16:00'), ('16:30')
) AS slots(start_time);

INSERT INTO appointments (id, patient_id, doctor_id, scheduled_at, duration_minutes, status, jitsi_room, reminder_24h_sent, reminder_1h_sent, created_at)
VALUES
    ('a1000000-0000-0000-0000-000000000001', 'd98ff004-e9b3-4738-bb9e-3d7e8273f707', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '10 days', 30, 'COMPLETED', 'medconnect-a1000000', true, true, NOW() - INTERVAL '11 days'),
    ('a1000000-0000-0000-0000-000000000002', 'd98ff004-e9b3-4738-bb9e-3d7e8273f707', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '20 days', 30, 'COMPLETED', 'medconnect-a1000002', true, true, NOW() - INTERVAL '21 days'),
    ('a1000000-0000-0000-0000-000000000003', 'd98ff004-e9b3-4738-bb9e-3d7e8273f707', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '5 days', 30, 'CANCELLED', 'medconnect-a1000003', true, true, NOW() - INTERVAL '6 days'),
    ('a1000000-0000-0000-0000-000000000004', 'd98ff004-e9b3-4738-bb9e-3d7e8273f707', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() + INTERVAL '3 days', 30, 'CONFIRMED', 'medconnect-a1000004', false, false, NOW() - INTERVAL '1 day');

-- Symptom forms for completed appointments
INSERT INTO symptom_forms (id, appointment_id, symptoms_text, duration_days, severity, medications, known_conditions, ai_brief, created_at)
VALUES
    (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000001', 'Persistent headache and mild fever for the past few days. The headache is mainly on the left side and gets worse in the evening.', 5, 6, 'Ibuprofen 400mg as needed', 'Mild hypertension', 'Summary: Patient reports persistent left-sided headache with mild fever lasting 5 days, worsening in evenings. Severity rated 6/10.

Urgency: Medium — Duration and pattern suggest tension or migraine-type headache; fever warrants further assessment.

Suggested questions:
- Any visual disturbances or nausea?
- Any recent stress or sleep changes?
- Has the fever been measured, and what was the reading?

Background: Patient is on ibuprofen PRN. Known mild hypertension — consider whether headache may be BP-related.', NOW() - INTERVAL '10 days'),
    (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000002', 'Lower back pain that started after moving furniture. Pain is sharp when bending and dull at rest.', 3, 7, 'None', 'None', 'Summary: Patient presents with acute lower back pain following physical exertion (moving furniture), rated 7/10. Sharp on movement, dull at rest.

Urgency: Low — Likely musculoskeletal strain from identifiable cause.

Suggested questions:
- Any radiation of pain to legs or feet?
- Any numbness or tingling?
- Able to walk and perform daily activities?

Background: No known conditions or medications reported. Rule out disc involvement if neurological symptoms present.', NOW() - INTERVAL '20 days');

-- Post-appointment notes for completed appointments
INSERT INTO appointment_notes (id, appointment_id, doctor_id, notes_text, created_at)
VALUES
    (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000001', '06ffed1b-6acf-44d5-9ecf-1ca878f64b5a', 'Patient presented with left-sided headache and low-grade fever (37.8°C). No visual disturbances reported. BP slightly elevated at 135/85. Advised to monitor BP daily, increase fluid intake, and rest. Prescribed paracetamol for fever management. Follow up in 2 weeks if symptoms persist.', NOW() - INTERVAL '10 days'),
    (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000002', '06ffed1b-6acf-44d5-9ecf-1ca878f64b5a', 'Acute lumbar strain from heavy lifting. No neurological symptoms detected. Range of motion limited but improving. Recommended ice/heat alternation, gentle stretching, and avoiding heavy lifting for 2 weeks. Referred to physiotherapy if no improvement within 10 days.', NOW() - INTERVAL '20 days');