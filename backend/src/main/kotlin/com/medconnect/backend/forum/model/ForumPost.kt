package com.medconnect.backend.forum.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "forum_posts")
data class ForumPost(

    @Id
    @GeneratedValue
    val id: UUID? = null,

    @Column(name = "author_id", nullable = false)
    val authorId: UUID,

    @Column(nullable = false)
    val title: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val content: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val category: ForumCategory,

    @Column(name = "likes_count")
    val likesCount: Int = 0,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now()
)

