package com.medconnect.backend.forum.dto

import com.medconnect.backend.forum.model.ForumCategory
import java.time.Instant
import java.util.UUID

data class ForumPostSummaryResponse(
    val id: UUID,
    val title: String,
    val content: String,
    val category: ForumCategory,
    val authorName: String,
    val authorRole: String,
    val likesCount: Int,
    val likedByMe: Boolean,
    val commentCount: Int,
    val createdAt: Instant
)

data class ForumPostDetailResponse(
    val id: UUID,
    val title: String,
    val content: String,
    val category: ForumCategory,
    val authorName: String,
    val authorRole: String,
    val likesCount: Int,
    val likedByMe: Boolean,
    val isOwner: Boolean,
    val createdAt: Instant,
    val comments: List<ForumCommentResponse>
)
