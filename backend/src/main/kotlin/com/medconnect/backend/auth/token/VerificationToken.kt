package com.medconnect.backend.auth.token

import com.medconnect.backend.user.User
import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "email_verification_tokens")
class VerificationToken(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(nullable = false, unique = true)
    val token: String = UUID.randomUUID().toString(),

    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant = Instant.now().plusSeconds(86_400),

    @Column(nullable = false)
    var used: Boolean = false
)