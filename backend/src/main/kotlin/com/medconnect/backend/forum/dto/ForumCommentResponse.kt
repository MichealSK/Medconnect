package com.medconnect.backend.forum.dto

import java.time.Instant
import java.util.UUID

data class ForumCommentResponse(
    val id: UUID,
    val content: String,
    val authorName: String,
    val authorRole: String,
    val likesCount: Int,
    val likedByMe: Boolean,
    val isOwner: Boolean,
    val createdAt: Instant,
    val replies: List<ForumReplyResponse> = emptyList()
)

data class ForumReplyResponse(
    val id: UUID,
    val content: String,
    val authorName: String,
    val authorRole: String,
    val likesCount: Int,
    val likedByMe: Boolean,
    val isOwner: Boolean,
    val createdAt: Instant
)