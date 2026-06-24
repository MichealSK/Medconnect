package com.medconnect.backend.forum.dto

import com.medconnect.backend.forum.model.ForumCategory

data class ForumPostRequest(
    val title: String,
    val content: String,
    val category: ForumCategory
)