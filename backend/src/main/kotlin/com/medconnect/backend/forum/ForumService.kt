package com.medconnect.backend.forum

import com.medconnect.backend.forum.dto.*
import com.medconnect.backend.forum.model.*
import com.medconnect.backend.forum.repository.*
import com.medconnect.backend.user.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
@Transactional
class ForumService(
    private val postRepository: ForumPostRepository,
    private val commentRepository: ForumCommentRepository,
    private val postLikeRepository: ForumPostLikeRepository,
    private val commentLikeRepository: ForumCommentLikeRepository,
    private val userRepository: UserRepository
) {

    fun createPost(request: ForumPostRequest, authorId: UUID): ForumPostSummaryResponse {
        val post = postRepository.save(
            ForumPost(
                authorId = authorId,
                title = request.title,
                content = request.content,
                category = request.category
            )
        )
        val author = userRepository.findById(authorId).orElseThrow()
        return ForumPostSummaryResponse(
            id = post.id!!,
            title = post.title,
            content = post.content,
            category = post.category,
            authorName = "${author.firstName} ${author.lastName}",
            authorRole = author.role.name,
            likesCount = 0,
            likedByMe = false,
            commentCount = 0,
            createdAt = post.createdAt
        )
    }

    @Transactional(readOnly = true)
    fun getPostDetail(postId: UUID, currentUserId: UUID?): ForumPostDetailResponse {
        val post = postRepository.findById(postId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found") }

        val postAuthor = userRepository.findById(post.authorId).orElseThrow()
        val likedByMe = currentUserId?.let { postLikeRepository.existsByPostIdAndUserId(postId, it) } ?: false

        val topLevelComments = commentRepository
            .findByPostIdAndParentCommentIdIsNullOrderByCreatedAtAsc(postId)

        val allCommentIds = topLevelComments.mapNotNull { it.id }
        val likedCommentIds = likedIdsByUser(allCommentIds, currentUserId)

        val commentResponses = topLevelComments.map { comment ->
            val commentAuthor = userRepository.findById(comment.authorId).orElseThrow()
            val replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.id!!)
            val likedReplyIds = likedIdsByUser(replies.mapNotNull { it.id }, currentUserId)

            ForumCommentResponse(
                id = comment.id!!,
                content = comment.content,
                authorName = "${commentAuthor.firstName} ${commentAuthor.lastName}",
                authorRole = commentAuthor.role.name,
                likesCount = comment.likesCount,
                likedByMe = comment.id in likedCommentIds,
                isOwner = currentUserId != null && comment.authorId == currentUserId,
                createdAt = comment.createdAt,
                replies = replies.map { reply ->
                    val replyAuthor = userRepository.findById(reply.authorId).orElseThrow()
                    ForumReplyResponse(
                        id = reply.id!!,
                        content = reply.content,
                        authorName = "${replyAuthor.firstName} ${replyAuthor.lastName}",
                        authorRole = replyAuthor.role.name,
                        likesCount = reply.likesCount,
                        likedByMe = reply.id in likedReplyIds,
                        isOwner = currentUserId != null && reply.authorId == currentUserId,
                        createdAt = reply.createdAt
                    )
                }
            )
        }

        return ForumPostDetailResponse(
            id = post.id!!,
            title = post.title,
            content = post.content,
            category = post.category,
            authorName = "${postAuthor.firstName} ${postAuthor.lastName}",
            authorRole = postAuthor.role.name,
            likesCount = post.likesCount,
            likedByMe = likedByMe,
            isOwner = currentUserId != null && post.authorId == currentUserId,
            createdAt = post.createdAt,
            comments = commentResponses
        )
    }

    fun togglePostLike(postId: UUID, userId: UUID): Map<String, Any> {
        postRepository.findById(postId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found") }

        val existing = postLikeRepository.findByPostIdAndUserId(postId, userId)
        return if (existing != null) {
            postLikeRepository.delete(existing)
            postRepository.decrementLikes(postId)
            mapOf("liked" to false)
        } else {
            postLikeRepository.save(ForumPostLike(postId = postId, userId = userId))
            postRepository.incrementLikes(postId)
            mapOf("liked" to true)
        }
    }

    fun deletePost(postId: UUID, userId: UUID) {
        val post = postRepository.findById(postId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found") }
        if (post.authorId != userId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own posts")
        }
        postRepository.delete(post)
    }

    fun addComment(postId: UUID, request: ForumCommentRequest, authorId: UUID): ForumCommentResponse {
        postRepository.findById(postId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found") }

        if (request.parentCommentId != null) {
            commentRepository.findById(request.parentCommentId)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment not found") }
        }

        val comment = commentRepository.save(
            ForumComment(
                postId = postId,
                authorId = authorId,
                parentCommentId = request.parentCommentId,
                content = request.content
            )
        )
        val author = userRepository.findById(authorId).orElseThrow()
        return ForumCommentResponse(
            id = comment.id!!,
            content = comment.content,
            authorName = "${author.firstName} ${author.lastName}",
            authorRole = author.role.name,
            likesCount = 0,
            likedByMe = false,
            isOwner = true,
            createdAt = comment.createdAt,
            replies = emptyList()
        )
    }

    fun toggleCommentLike(commentId: UUID, userId: UUID): Map<String, Any> {
        commentRepository.findById(commentId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found") }

        val existing = commentLikeRepository.findByCommentIdAndUserId(commentId, userId)
        return if (existing != null) {
            commentLikeRepository.delete(existing)
            commentRepository.decrementLikes(commentId)
            mapOf("liked" to false)
        } else {
            commentLikeRepository.save(ForumCommentLike(commentId = commentId, userId = userId))
            commentRepository.incrementLikes(commentId)
            mapOf("liked" to true)
        }
    }

    fun deleteComment(commentId: UUID, userId: UUID) {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found") }
        if (comment.authorId != userId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own comments")
        }
        commentRepository.delete(comment)
    }

    @Transactional(readOnly = true)
    fun getMyPosts(userId: UUID): List<ForumPostSummaryResponse> {
        return postRepository.findByAuthorId(userId).map { it.toSummaryResponse(userId) }
    }

    @Transactional(readOnly = true)
    fun getCommentedPosts(userId: UUID): List<ForumPostSummaryResponse> {
        return postRepository.findPostsCommentedByUser(userId).map { it.toSummaryResponse(userId) }
    }

    @Transactional(readOnly = true)
    fun getLikedPosts(userId: UUID): List<ForumPostSummaryResponse> {
        return postRepository.findPostsLikedByUser(userId).map { it.toSummaryResponse(userId) }
    }

    private fun ForumPost.toSummaryResponse(currentUserId: UUID): ForumPostSummaryResponse {
        val author = userRepository.findById(this.authorId).orElseThrow()
        val commentCount = commentRepository.findByPostIdAndParentCommentIdIsNullOrderByCreatedAtAsc(this.id!!).size
        val likedByMe = postLikeRepository.existsByPostIdAndUserId(this.id!!, currentUserId)
        return ForumPostSummaryResponse(
            id = this.id!!,
            title = this.title,
            content = this.content,
            category = this.category,
            authorName = "${author.firstName} ${author.lastName}",
            authorRole = author.role.name,
            likesCount = this.likesCount,
            likedByMe = likedByMe,
            commentCount = commentCount,
            createdAt = this.createdAt
        )
    }

    @Transactional(readOnly = true)
    fun getPosts(
        category: ForumCategory?,
        search: String?,
        pageable: Pageable,
        currentUserId: UUID?
    ): Page<ForumPostSummaryResponse> {
        val posts = when {
            !search.isNullOrBlank() -> postRepository.searchPosts(search, pageable)
            category != null -> postRepository.findByCategory(category, pageable)
            else -> postRepository.findAll(pageable)
        }

        val likedPostIds = likedPostIdsByUser(posts.content.mapNotNull { it.id }, currentUserId)
        return posts.map { it.toSummaryResponse(likedPostIds) }
    }

    private fun likedIdsByUser(commentIds: List<UUID>, userId: UUID?): Set<UUID> {
        if (userId == null || commentIds.isEmpty()) return emptySet()
        return commentLikeRepository.findByCommentIdIn(commentIds)
            .filter { it.userId == userId }
            .map { it.commentId }
            .toSet()
    }

    private fun likedPostIdsByUser(postIds: List<UUID>, userId: UUID?): Set<UUID> {
        if (userId == null || postIds.isEmpty()) return emptySet()
        return postLikeRepository.findByPostIdIn(postIds)
            .filter { it.userId == userId }
            .map { it.postId }
            .toSet()
    }

    private fun ForumPost.toSummaryResponse(likedPostIds: Set<UUID>): ForumPostSummaryResponse {
        val author = userRepository.findById(this.authorId).orElseThrow()
        val commentCount = commentRepository.findByPostIdAndParentCommentIdIsNullOrderByCreatedAtAsc(this.id!!).size
        return ForumPostSummaryResponse(
            id = this.id!!,
            title = this.title,
            content = this.content,
            category = this.category,
            authorName = "${author.firstName} ${author.lastName}",
            authorRole = author.role.name,
            likesCount = this.likesCount,
            likedByMe = this.id in likedPostIds,
            commentCount = commentCount,
            createdAt = this.createdAt
        )
    }
}