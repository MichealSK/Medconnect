package com.medconnect.backend.forum.repository

import com.medconnect.backend.forum.model.ForumPostLike
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ForumPostLikeRepository : JpaRepository<ForumPostLike, UUID> {
    fun findByPostIdAndUserId(postId: UUID, userId: UUID): ForumPostLike?
    fun existsByPostIdAndUserId(postId: UUID, userId: UUID): Boolean
    fun findByPostIdIn(postIds: List<UUID>): List<ForumPostLike>
}