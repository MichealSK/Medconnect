package com.medconnect.backend.forum.repository


import com.medconnect.backend.forum.model.ForumComment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ForumCommentRepository : JpaRepository<ForumComment, UUID> {

    fun findByPostIdAndParentCommentIdIsNullOrderByCreatedAtAsc(postId: UUID): List<ForumComment>

    fun findByParentCommentIdOrderByCreatedAtAsc(parentCommentId: UUID): List<ForumComment>

    @Modifying
    @Query("UPDATE ForumComment c SET c.likesCount = c.likesCount + 1 WHERE c.id = :id")
    fun incrementLikes(id: UUID)

    @Modifying
    @Query("UPDATE ForumComment c SET c.likesCount = c.likesCount - 1 WHERE c.id = :id AND c.likesCount > 0")
    fun decrementLikes(id: UUID)
}