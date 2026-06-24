ALTER TABLE doctor_profiles
    ADD COLUMN average_rating DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN review_count INT DEFAULT 0;

CREATE TABLE reviews (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id),
                         patient_id UUID NOT NULL REFERENCES users(id),
                         doctor_id UUID NOT NULL REFERENCES doctor_profiles(id),
                         rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                         comment TEXT,
                         created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_doctor_id ON reviews(doctor_id);
CREATE INDEX idx_reviews_patient_id ON reviews(patient_id);