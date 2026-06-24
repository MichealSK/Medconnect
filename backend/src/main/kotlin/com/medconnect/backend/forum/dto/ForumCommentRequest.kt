package com.medconnect.backend.forum.dto

import java.util.UUID

data class ForumCommentRequest(
    val content: String,
    val parentCommentId: UUID? = null
)