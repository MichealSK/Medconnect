package com.medconnect.backend.forum.model


import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "forum_comments")
data class ForumComment(

    @Id
    @GeneratedValue
    val id: UUID? = null,

    @Column(name = "post_id", nullable = false)
    val postId: UUID,

    @Column(name = "author_id", nullable = false)
    val authorId: UUID,

    @Column(name = "parent_comment_id")
    val parentCommentId: UUID? = null,

    @Column(nullable = false, columnDefinition = "TEXT")
    val content: String,

    @Column(name = "likes_count")
    val likesCount: Int = 0,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now()
)