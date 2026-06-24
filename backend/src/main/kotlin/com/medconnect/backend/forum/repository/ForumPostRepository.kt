package com.medconnect.backend.forum.repository

import com.medconnect.backend.forum.model.ForumCategory
import com.medconnect.backend.forum.model.ForumPost
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ForumPostRepository : JpaRepository<ForumPost, UUID> {

    fun findByCategory(category: ForumCategory, pageable: Pageable): Page<ForumPost>

    fun findByAuthorId(authorId: UUID): List<ForumPost>

    @Query("SELECT DISTINCT p FROM ForumPost p JOIN ForumComment c ON c.postId = p.id WHERE c.authorId = :userId")
    fun findPostsCommentedByUser(userId: UUID): List<ForumPost>

    @Query("SELECT p FROM ForumPost p JOIN ForumPostLike l ON l.postId = p.id WHERE l.userId = :userId")
    fun findPostsLikedByUser(userId: UUID): List<ForumPost>

    @Modifying
    @Query("UPDATE ForumPost p SET p.likesCount = p.likesCount + 1 WHERE p.id = :id")
    fun incrementLikes(id: UUID)

    @Modifying
    @Query("UPDATE ForumPost p SET p.likesCount = p.likesCount - 1 WHERE p.id = :id AND p.likesCount > 0")
    fun decrementLikes(id: UUID)

    @Query("SELECT p FROM ForumPost p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))")
    fun searchPosts(search: String, pageable: Pageable): Page<ForumPost>
}