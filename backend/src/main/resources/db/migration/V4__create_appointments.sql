CREATE TABLE appointments (
                              id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              patient_id        UUID NOT NULL REFERENCES users(id),
                              doctor_id         UUID NOT NULL REFERENCES doctor_profiles(id),
                              scheduled_at      TIMESTAMP NOT NULL,
                              duration_minutes  INT NOT NULL DEFAULT 30,
                              status            VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                                  CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED')),
                              jitsi_room        VARCHAR(255) UNIQUE,
                              reminder_24h_sent BOOLEAN NOT NULL DEFAULT false,
                              reminder_1h_sent  BOOLEAN NOT NULL DEFAULT false,
                              created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);