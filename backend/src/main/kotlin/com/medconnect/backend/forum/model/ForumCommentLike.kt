package com.medconnect.backend.forum.model

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(
    name = "forum_comment_likes",
    uniqueConstraints = [UniqueConstraint(columnNames = ["comment_id", "user_id"])]
)
data class ForumCommentLike(

    @Id
    @GeneratedValue
    val id: UUID? = null,

    @Column(name = "comment_id", nullable = false)
    val commentId: UUID,

    @Column(name = "user_id", nullable = false)
    val userId: UUID
)