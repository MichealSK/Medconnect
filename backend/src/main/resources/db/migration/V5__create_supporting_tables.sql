CREATE TABLE symptom_forms (
                               id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
                               symptoms_text  TEXT NOT NULL,
                               duration_days  INT,
                               severity       INT CHECK (severity BETWEEN 1 AND 10),
                               medications    TEXT,
                               known_conditions TEXT,
                               ai_brief       TEXT,
                               created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
                               UNIQUE(appointment_id)
);

CREATE TABLE appointment_notes (
                                   id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                   appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
                                   doctor_id      UUID NOT NULL REFERENCES users(id),
                                   notes_text     TEXT NOT NULL,
                                   created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
                               id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               type       VARCHAR(60) NOT NULL,
                               message    TEXT NOT NULL,
                               is_read    BOOLEAN NOT NULL DEFAULT false,
                               created_at TIMESTAMP NOT NULL DEFAULT NOW()
);