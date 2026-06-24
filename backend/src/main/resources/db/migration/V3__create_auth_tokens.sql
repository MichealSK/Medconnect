CREATE TABLE email_verification_tokens (
                                           id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                           user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                           token      VARCHAR(255) NOT NULL UNIQUE,
                                           expires_at TIMESTAMP   NOT NULL,
                                           used       BOOLEAN     NOT NULL DEFAULT false,
                                           created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
                                       id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                       user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                       token      VARCHAR(255) NOT NULL UNIQUE,
                                       expires_at TIMESTAMP   NOT NULL,
                                       used       BOOLEAN     NOT NULL DEFAULT false,
                                       created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);