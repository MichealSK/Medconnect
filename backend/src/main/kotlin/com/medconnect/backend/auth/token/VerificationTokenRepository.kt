package com.medconnect.backend.auth.token

import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant
import java.util.UUID

interface VerificationTokenRepository : JpaRepository<VerificationToken, UUID> {
    fun findByToken(token: String): VerificationToken?
    fun deleteAllByUserId(userId: UUID)
    fun deleteAllByExpiresAtBefore(instant: Instant)
}

interface PasswordResetTokenRepository : JpaRepository<PasswordResetToken, UUID> {
    fun findByToken(token: String): PasswordResetToken?
    fun deleteAllByUserId(userId: UUID)
    fun deleteAllByExpiresAtBefore(instant: Instant)
}