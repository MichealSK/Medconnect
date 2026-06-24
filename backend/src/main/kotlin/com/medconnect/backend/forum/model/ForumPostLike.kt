package com.medconnect.backend.forum.model


import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(
    name = "forum_post_likes",
    uniqueConstraints = [UniqueConstraint(columnNames = ["post_id", "user_id"])]
)
data class ForumPostLike(

    @Id
    @GeneratedValue
    val id: UUID? = null,

    @Column(name = "post_id", nullable = false)
    val postId: UUID,

    @Column(name = "user_id", nullable = false)
    val userId: UUID
)