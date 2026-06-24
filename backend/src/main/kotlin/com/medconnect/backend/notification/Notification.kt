package com.medconnect.backend.notification

import com.medconnect.backend.user.User
import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "notifications")
class Notification(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(nullable = false)
    val type: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val message: String,

    @Column(nullable = false)
    var isRead: Boolean = false,

    @Column(nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
)