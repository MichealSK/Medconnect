CREATE TABLE doctor_profiles (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialty         VARCHAR(100) NOT NULL,
    bio               TEXT,
    languages         TEXT[]       NOT NULL DEFAULT '{}',
    timezone          VARCHAR(60)  NOT NULL DEFAULT 'UTC',
    years_experience  INT,
    profile_photo_url VARCHAR(500),
    UNIQUE(user_id)
);

CREATE TABLE availability_slots (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id   UUID    NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    day_of_week INT     NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time  TIME    NOT NULL,
    end_time    TIME    NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT true
);