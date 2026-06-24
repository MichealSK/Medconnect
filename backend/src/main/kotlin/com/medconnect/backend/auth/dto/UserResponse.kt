package com.medconnect.backend.auth.dto

data class UserResponse(
    val email: String,
    val role: String,
    val firstName: String,
    val lastName: String,
    val emailVerified: Boolean
)