package com.medconnect.backend.forum.repository

import com.medconnect.backend.forum.model.ForumCommentLike

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ForumCommentLikeRepository : JpaRepository<ForumCommentLike, UUID> {
    fun findByCommentIdAndUserId(commentId: UUID, userId: UUID): ForumCommentLike?
    fun findByCommentIdIn(commentIds: List<UUID>): List<ForumCommentLike>
}