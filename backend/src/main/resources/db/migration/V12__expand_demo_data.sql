-- =============================================================================
-- V12__expand_demo_data.sql
-- Expands demo data:
--   - 35 additional patients (total 50)
--   - Reviews for all 30 seeded doctors that had none
--   - Extra reviews + updated bio for Dr. Riste Petkov
--     user_id  : 06ffed1b-6acf-44d5-9ecf-1ca878f64b5a
--     profile_id: df36e6d0-9c25-4c4b-b34c-73add78ee6cb
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. 35 ADDITIONAL PATIENTS (c20... series to avoid collision with c10... from V11)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, role, first_name, last_name, email_verified, created_at) VALUES
                                                                                                          ('c2000000-0000-0000-0000-000000000001', 'ivan.stojanovski@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Ivan',      'Stojanovski', true, NOW() - INTERVAL '110 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000002', 'maria.georgieva@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Maria',     'Georgieva',   true, NOW() - INTERVAL '108 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000003', 'aleksa.nikolic@gmail.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Aleksa',    'Nikolic',     true, NOW() - INTERVAL '106 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000004', 'hana.kovacevic@gmail.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Hana',      'Kovacevic',   true, NOW() - INTERVAL '104 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000005', 'tom.nguyen@gmail.com',          '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Tom',       'Nguyen',      true, NOW() - INTERVAL '102 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000006', 'sara.lindqvist@gmail.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Sara',      'Lindqvist',   true, NOW() - INTERVAL '100 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000007', 'kevin.okonkwo@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Kevin',     'Okonkwo',     true, NOW() - INTERVAL '98 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000008', 'ana.petrovic@gmail.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Ana',       'Petrovic',    true, NOW() - INTERVAL '96 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000009', 'felix.bauer@gmail.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Felix',     'Bauer',       true, NOW() - INTERVAL '94 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000010', 'nina.hassan@gmail.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Nina',      'Hassan',      true, NOW() - INTERVAL '92 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000011', 'carlos.reyes@gmail.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Carlos',    'Reyes',       true, NOW() - INTERVAL '90 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000012', 'julia.schneider@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Julia',     'Schneider',   true, NOW() - INTERVAL '88 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000013', 'omar.sheikh@gmail.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Omar',      'Sheikh',      true, NOW() - INTERVAL '86 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000014', 'lena.bergstrom@gmail.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Lena',      'Bergstrom',   true, NOW() - INTERVAL '84 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000015', 'david.osei@gmail.com',          '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'David',     'Osei',        true, NOW() - INTERVAL '82 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000016', 'ines.ferreira@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Ines',      'Ferreira',    true, NOW() - INTERVAL '80 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000017', 'milan.jovanovic@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Milan',     'Jovanovic',   true, NOW() - INTERVAL '78 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000018', 'claire.dubois@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Claire',    'Dubois',      true, NOW() - INTERVAL '76 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000019', 'ahmed.mansour@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Ahmed',     'Mansour',     true, NOW() - INTERVAL '74 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000020', 'yuki.yamamoto@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Yuki',      'Yamamoto',    true, NOW() - INTERVAL '72 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000021', 'petra.novakova@gmail.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Petra',     'Novakova',    true, NOW() - INTERVAL '70 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000022', 'ryan.oconnor@gmail.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Ryan',      'O''Connor',   true, NOW() - INTERVAL '68 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000023', 'fatima.benali@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Fatima',    'Benali',      true, NOW() - INTERVAL '66 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000024', 'stefan.mueller@gmail.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Stefan',    'Mueller',     true, NOW() - INTERVAL '64 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000025', 'amelia.watson@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Amelia',    'Watson',      true, NOW() - INTERVAL '62 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000026', 'diego.herrera@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Diego',     'Herrera',     true, NOW() - INTERVAL '60 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000027', 'zara.hussain@gmail.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Zara',      'Hussain',     true, NOW() - INTERVAL '58 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000028', 'lukas.horak@gmail.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Lukas',     'Horak',       true, NOW() - INTERVAL '56 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000029', 'chiara.romano@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Chiara',    'Romano',      true, NOW() - INTERVAL '54 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000030', 'kwesi.mensah@gmail.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Kwesi',     'Mensah',      true, NOW() - INTERVAL '52 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000031', 'sophie.martin@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Sophie',    'Martin',      true, NOW() - INTERVAL '50 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000032', 'arjun.patel@gmail.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Arjun',     'Patel',       true, NOW() - INTERVAL '48 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000033', 'elena.vasquez@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Elena',     'Vasquez',     true, NOW() - INTERVAL '46 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000034', 'tobias.eriksson@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Tobias',    'Eriksson',    true, NOW() - INTERVAL '44 days'),
                                                                                                          ('c2000000-0000-0000-0000-000000000035', 'amira.saleh@gmail.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'PATIENT', 'Amira',     'Saleh',       true, NOW() - INTERVAL '42 days');

-- -----------------------------------------------------------------------------
-- 2. DR. RISTE PETKOV — updated bio
--    profile_id: df36e6d0-9c25-4c4b-b34c-73add78ee6cb
-- -----------------------------------------------------------------------------
UPDATE doctor_profiles SET bio =
                               'Dr. Riste Petkov is a distinguished specialist with over a decade of clinical experience, widely regarded by his patients as one of the most thorough and compassionate doctors on the platform. He completed his medical degree with distinction and pursued advanced subspecialty training at leading European institutions, bringing international standards of care to every consultation. Dr. Petkov is known for his meticulous diagnostic approach — he never rushes a consultation and ensures every patient leaves with a clear understanding of their condition and a detailed, personalised management plan. He has a particular interest in chronic disease management and preventive medicine, believing strongly that early intervention and patient education are the most powerful tools available to any clinician. Outside of his clinical work, Dr. Petkov is an active medical educator and mentor, supervising junior doctors and contributing to postgraduate training programmes. His patients consistently highlight his exceptional communication skills, his patience with complex cases, and his genuine commitment to their long-term wellbeing. He consults in Macedonian and English and welcomes patients from across the region.'
WHERE id = 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb';

-- -----------------------------------------------------------------------------
-- 3. COMPLETED APPOINTMENTS for new reviews
--    Series e10... for appointments, covering:
--      - All 30 seeded doctors that need reviews (doctors b10...016 to b10...030
--        plus extra rounds for some, plus many for Dr. Petkov)
--      - Dr. Petkov uses profile_id df36e6d0-...
-- -----------------------------------------------------------------------------
INSERT INTO appointments (id, patient_id, doctor_id, scheduled_at, duration_minutes, status, jitsi_room, reminder_24h_sent, reminder_1h_sent, created_at) VALUES

-- Doctors b10...016 to b10...030 (no reviews yet from V11)
('e1100000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000016', NOW() - INTERVAL '70 days', 30, 'COMPLETED', 'medconnect-e1100000001', true, true, NOW() - INTERVAL '72 days'),
('e1100000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000017', NOW() - INTERVAL '68 days', 30, 'COMPLETED', 'medconnect-e1100000002', true, true, NOW() - INTERVAL '70 days'),
('e1100000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000018', NOW() - INTERVAL '66 days', 30, 'COMPLETED', 'medconnect-e1100000003', true, true, NOW() - INTERVAL '68 days'),
('e1100000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000019', NOW() - INTERVAL '64 days', 30, 'COMPLETED', 'medconnect-e1100000004', true, true, NOW() - INTERVAL '66 days'),
('e1100000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000020', NOW() - INTERVAL '62 days', 30, 'COMPLETED', 'medconnect-e1100000005', true, true, NOW() - INTERVAL '64 days'),
('e1100000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000023', NOW() - INTERVAL '60 days', 30, 'COMPLETED', 'medconnect-e1100000006', true, true, NOW() - INTERVAL '62 days'),
('e1100000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000024', NOW() - INTERVAL '58 days', 30, 'COMPLETED', 'medconnect-e1100000007', true, true, NOW() - INTERVAL '60 days'),
('e1100000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000025', NOW() - INTERVAL '56 days', 30, 'COMPLETED', 'medconnect-e1100000008', true, true, NOW() - INTERVAL '58 days'),
('e1100000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000026', NOW() - INTERVAL '54 days', 30, 'COMPLETED', 'medconnect-e1100000009', true, true, NOW() - INTERVAL '56 days'),
('e1100000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000028', NOW() - INTERVAL '52 days', 30, 'COMPLETED', 'medconnect-e1100000010', true, true, NOW() - INTERVAL '54 days'),
('e1100000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000029', NOW() - INTERVAL '50 days', 30, 'COMPLETED', 'medconnect-e1100000011', true, true, NOW() - INTERVAL '52 days'),
('e1100000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000030', NOW() - INTERVAL '48 days', 30, 'COMPLETED', 'medconnect-e1100000012', true, true, NOW() - INTERVAL '50 days'),
-- second reviews for some of those doctors
('e1100000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000016', NOW() - INTERVAL '46 days', 30, 'COMPLETED', 'medconnect-e1100000013', true, true, NOW() - INTERVAL '48 days'),
('e1100000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000018', NOW() - INTERVAL '44 days', 30, 'COMPLETED', 'medconnect-e1100000014', true, true, NOW() - INTERVAL '46 days'),
('e1100000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000023', NOW() - INTERVAL '42 days', 30, 'COMPLETED', 'medconnect-e1100000015', true, true, NOW() - INTERVAL '44 days'),

-- Dr. Riste Petkov appointments (profile_id: df36e6d0-...)
('e1100000-0000-0000-0000-000000000016', 'c2000000-0000-0000-0000-000000000016', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '80 days', 30, 'COMPLETED', 'medconnect-e1100000016', true, true, NOW() - INTERVAL '82 days'),
('e1100000-0000-0000-0000-000000000017', 'c2000000-0000-0000-0000-000000000017', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '75 days', 30, 'COMPLETED', 'medconnect-e1100000017', true, true, NOW() - INTERVAL '77 days'),
('e1100000-0000-0000-0000-000000000018', 'c2000000-0000-0000-0000-000000000018', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '70 days', 30, 'COMPLETED', 'medconnect-e1100000018', true, true, NOW() - INTERVAL '72 days'),
('e1100000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000019', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '65 days', 30, 'COMPLETED', 'medconnect-e1100000019', true, true, NOW() - INTERVAL '67 days'),
('e1100000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000020', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '60 days', 30, 'COMPLETED', 'medconnect-e1100000020', true, true, NOW() - INTERVAL '62 days'),
('e1100000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000021', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '55 days', 30, 'COMPLETED', 'medconnect-e1100000021', true, true, NOW() - INTERVAL '57 days'),
('e1100000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000022', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '50 days', 30, 'COMPLETED', 'medconnect-e1100000022', true, true, NOW() - INTERVAL '52 days'),
('e1100000-0000-0000-0000-000000000023', 'c2000000-0000-0000-0000-000000000023', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '45 days', 30, 'COMPLETED', 'medconnect-e1100000023', true, true, NOW() - INTERVAL '47 days'),
('e1100000-0000-0000-0000-000000000024', 'c2000000-0000-0000-0000-000000000024', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '40 days', 30, 'COMPLETED', 'medconnect-e1100000024', true, true, NOW() - INTERVAL '42 days'),
('e1100000-0000-0000-0000-000000000025', 'c2000000-0000-0000-0000-000000000025', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '35 days', 30, 'COMPLETED', 'medconnect-e1100000025', true, true, NOW() - INTERVAL '37 days'),
('e1100000-0000-0000-0000-000000000026', 'c2000000-0000-0000-0000-000000000026', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '30 days', 30, 'COMPLETED', 'medconnect-e1100000026', true, true, NOW() - INTERVAL '32 days'),
('e1100000-0000-0000-0000-000000000027', 'c2000000-0000-0000-0000-000000000027', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '25 days', 30, 'COMPLETED', 'medconnect-e1100000027', true, true, NOW() - INTERVAL '27 days'),
('e1100000-0000-0000-0000-000000000028', 'c2000000-0000-0000-0000-000000000028', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '20 days', 30, 'COMPLETED', 'medconnect-e1100000028', true, true, NOW() - INTERVAL '22 days'),
('e1100000-0000-0000-0000-000000000029', 'c2000000-0000-0000-0000-000000000029', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '15 days', 30, 'COMPLETED', 'medconnect-e1100000029', true, true, NOW() - INTERVAL '17 days'),
('e1100000-0000-0000-0000-000000000030', 'c2000000-0000-0000-0000-000000000030', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', NOW() - INTERVAL '10 days', 30, 'COMPLETED', 'medconnect-e1100000030', true, true, NOW() - INTERVAL '12 days');

-- -----------------------------------------------------------------------------
-- 4. REVIEWS for doctors that had none + extra for Dr. Petkov
-- -----------------------------------------------------------------------------
INSERT INTO reviews (id, appointment_id, patient_id, doctor_id, rating, comment, created_at) VALUES

-- b10...016 Dr. Nina Johansson (Pediatrics)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000016', 5,
 'Dr. Johansson was exceptional with our son. She immediately put him at ease and took his developmental concerns seriously. Her assessment was thorough and she gave us practical, actionable guidance we could use straight away. We left the consultation feeling genuinely supported.',
 NOW() - INTERVAL '69 days'),

-- b10...017 Dr. Kwame Asante (General Practice)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000017', 5,
 'Dr. Asante was brilliant. He immediately identified that my symptoms matched a tropical infection I had not even considered and ordered the right tests. His knowledge of infectious disease is clearly outstanding. Clear, confident, and reassuring.',
 NOW() - INTERVAL '67 days'),

-- b10...018 Dr. Isabelle Dupont (Gynecology)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000018', 5,
 'Dr. Dupont managed my high-risk pregnancy with extraordinary care and expertise. Every concern I had was taken seriously and investigated thoroughly. I always left her consultations feeling informed and calm. I cannot thank her enough for the outcome we had.',
 NOW() - INTERVAL '65 days'),

-- b10...019 Dr. Rafael Torres (Dermatology - hair)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000019', 4,
 'Dr. Torres did a very thorough assessment of my hair loss including dermoscopy which no other dermatologist had done before. He identified the specific pattern and gave me a clear treatment plan. Still early days but I feel confident I am finally on the right track.',
 NOW() - INTERVAL '63 days'),

-- b10...020 Dr. Aisha Diallo (Child Psychiatry)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000020', 5,
 'Dr. Diallo was wonderful with my teenager. She created a safe and non-judgmental space immediately. My child opened up to her in a way I have not seen before. The approach she recommended has already made a noticeable positive difference at home and at school.',
 NOW() - INTERVAL '61 days'),

-- b10...023 Dr. Samuel Osei (General Practice)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000023', 5,
 'Dr. Osei is exactly what a GP should be. He spent real time understanding my situation, reviewed my medications carefully, and adjusted my diabetes management in a way that has actually improved my numbers. Highly recommended.',
 NOW() - INTERVAL '59 days'),

-- b10...024 Dr. Valentina Russo (Gynecology - endometriosis)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000024', 5,
 'Dr. Russo is the first doctor who has ever validated my endometriosis symptoms properly. She explained the condition comprehensively, outlined all the management options clearly, and referred me to exactly the right specialist. I only wish I had found her sooner.',
 NOW() - INTERVAL '57 days'),

-- b10...025 Dr. Ali Hassan (Psychiatry - addiction)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000025', 5,
 'Coming to Dr. Hassan was one of the hardest things I have done. He made it one of the most productive. No judgment, no platitudes — just genuine expertise, a clear treatment plan, and real compassion. I am three months into recovery and doing well.',
 NOW() - INTERVAL '55 days'),

-- b10...026 Dr. Marie Leblanc (Pediatrics - neonatal)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000026', 5,
 'Dr. Leblanc followed our premature daughter from the NICU through her first year. Her expertise is remarkable and her ability to communicate complex developmental information clearly to anxious parents is a real gift. Our daughter is thriving and Dr. Leblanc is a big part of that.',
 NOW() - INTERVAL '53 days'),

-- b10...028 Dr. Grace Adeyemi (Orthopedics)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000028', 5,
 'Dr. Adeyemi performed my hip replacement and the result has been life-changing. She explained every step of the process clearly, managed my expectations realistically, and her surgical technique was excellent. I was walking the same day. Cannot recommend her highly enough.',
 NOW() - INTERVAL '51 days'),

-- b10...029 Dr. Marco Ferrari (Cardiology - imaging)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000029', 5,
 'Dr. Ferrari''s expertise in cardiac imaging is extraordinary. He identified a valve abnormality that previous echocardiograms had missed and gave me a detailed explanation of what it meant and what needed to happen next. His reports are meticulous and his communication is excellent.',
 NOW() - INTERVAL '49 days'),

-- b10...030 Dr. Nadia Petrov (Dermatology - psoriasis)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000030', 4,
 'Dr. Petrov was very knowledgeable about psoriasis and up to date with the latest treatment options. She was the first dermatologist to properly assess the impact on my quality of life and discuss biologic therapy seriously. My skin has improved significantly since starting treatment.',
 NOW() - INTERVAL '47 days'),

-- second reviews for b10...016, b10...018, b10...023
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000016', 5,
 'We have been seeing Dr. Johansson for two years for our daughter''s ADHD. She has been consistently excellent — thorough, up to date, and genuinely invested in our daughter''s progress. The school support letters she provides are detailed and very effective.',
 NOW() - INTERVAL '45 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000014', 'c2000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000018', 5,
 'Dr. Dupont guided us through IVF preparation with patience and expertise. She explained every step clearly and was always available to answer questions between appointments. We are now 20 weeks pregnant and enormously grateful for her care.',
 NOW() - INTERVAL '43 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000015', 'c2000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000023', 4,
 'Dr. Osei manages my hypertension and chronic kidney disease with real care and attention to detail. He monitors both conditions together which my previous GP never did properly. My blood pressure is now well controlled for the first time in years.',
 NOW() - INTERVAL '41 days'),

-- Dr. Riste Petkov reviews (profile_id: df36e6d0-...)
(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000016', 'c2000000-0000-0000-0000-000000000016', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Dr. Petkov is without doubt the best doctor I have consulted through this platform. He took a complete history, asked questions no other doctor had thought to ask, and gave me a diagnosis that had been missed for two years. His knowledge and dedication are exceptional.',
 NOW() - INTERVAL '79 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000017', 'c2000000-0000-0000-0000-000000000017', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'I was nervous about my first online consultation but Dr. Petkov made it completely comfortable. He was thorough, attentive, and clearly very experienced. The plan he gave me was practical and easy to follow. Already feeling much better after two weeks.',
 NOW() - INTERVAL '74 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000018', 'c2000000-0000-0000-0000-000000000018', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Dr. Petkov is an extraordinary clinician. He identified a connection between two symptoms I had mentioned separately that turned out to be the key to the whole picture. I left the consultation with answers I had been looking for for months. Absolutely outstanding.',
 NOW() - INTERVAL '69 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000019', 'c2000000-0000-0000-0000-000000000019', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Exceptional consultation. Dr. Petkov was thorough, calm, and completely focused throughout. He explained my condition in a way that finally made sense and the referral he organised came through within days. I cannot recommend him highly enough.',
 NOW() - INTERVAL '64 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000020', 'c2000000-0000-0000-0000-000000000020', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Dr. Petkov listened to everything I said without interrupting, asked very thoughtful follow-up questions, and then gave me a clear and confident assessment. I have seen many doctors about this problem and none came close to his level of care and competence.',
 NOW() - INTERVAL '59 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000021', 'c2000000-0000-0000-0000-000000000021', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 4,
 'Very good consultation. Dr. Petkov was thorough and professional, and the medication he prescribed has been effective. The only reason I am not giving 5 stars is that I had a short wait for my follow-up appointment, but the care itself was excellent.',
 NOW() - INTERVAL '54 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000022', 'c2000000-0000-0000-0000-000000000022', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'I have been seeing Dr. Petkov for six months now for a chronic condition and the improvement in my quality of life has been remarkable. He adjusts the management plan at each review based on how I am doing and always explains the reasoning. Truly patient-centred care.',
 NOW() - INTERVAL '49 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000023', 'c2000000-0000-0000-0000-000000000023', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Dr. Petkov took my symptoms seriously from the very first message. His clinical assessment was detailed and he was completely transparent about his reasoning. The investigation he recommended confirmed the diagnosis quickly. Excellent doctor.',
 NOW() - INTERVAL '44 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000024', 'c2000000-0000-0000-0000-000000000024', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'My elderly mother saw Dr. Petkov and the experience was wonderful. He was patient, spoke slowly and clearly, and made sure she understood everything before moving on. He treated her with great dignity and respect. We will definitely be back.',
 NOW() - INTERVAL '39 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000025', 'c2000000-0000-0000-0000-000000000025', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Outstanding doctor. Dr. Petkov combines genuine clinical expertise with a warmth and patience that makes even difficult consultations feel manageable. He never makes you feel rushed or like your concerns are trivial. One of the best medical experiences I have had.',
 NOW() - INTERVAL '34 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000026', 'c2000000-0000-0000-0000-000000000026', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Dr. Petkov is the reason I trust telemedicine now. I was sceptical at first but the quality of his consultation was better than most in-person appointments I have had. He was thorough, precise, and clearly very experienced. Highly recommended.',
 NOW() - INTERVAL '29 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000027', 'c2000000-0000-0000-0000-000000000027', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'I saw Dr. Petkov after weeks of feeling unwell and getting no answers. Within one consultation he had a working diagnosis, a clear investigation plan, and had already submitted a referral. Results came back confirming his assessment exactly. Exceptional clinical instinct.',
 NOW() - INTERVAL '24 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000028', 'c2000000-0000-0000-0000-000000000028', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Dr. Petkov managed a complex situation involving multiple symptoms very effectively. He did not just treat each symptom separately but looked at the whole picture. His holistic approach made a real difference and I am grateful for his time and expertise.',
 NOW() - INTERVAL '19 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000029', 'c2000000-0000-0000-0000-000000000029', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'The best consultation I have had in years. Dr. Petkov was knowledgeable, attentive, and genuinely caring. He followed up after the appointment to check on my progress which I was not expecting and which meant a great deal. A truly excellent doctor.',
 NOW() - INTERVAL '14 days'),

(gen_random_uuid(), 'e1100000-0000-0000-0000-000000000030', 'c2000000-0000-0000-0000-000000000030', 'df36e6d0-9c25-4c4b-b34c-73add78ee6cb', 5,
 'Dr. Petkov has been managing my condition for several months now and the care has been consistently excellent. He is always prepared, always thorough, and always takes my concerns seriously. I feel fortunate to have found such a skilled and dedicated clinician.',
 NOW() - INTERVAL '9 days');

-- -----------------------------------------------------------------------------
-- 5. RECALCULATE average_rating and review_count for ALL doctors
-- -----------------------------------------------------------------------------
UPDATE doctor_profiles dp
SET
    average_rating = sub.avg_rating,
    review_count   = sub.cnt
    FROM (
    SELECT doctor_id,
           ROUND(AVG(rating)::numeric, 2) AS avg_rating,
           COUNT(*) AS cnt
    FROM reviews
    GROUP BY doctor_id
) sub
WHERE dp.id = sub.doctor_id;