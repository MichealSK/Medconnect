package com.medconnect.backend.auth.dto

data class AuthResponse(
    val accessToken: String,
    val email: String,
    val role: String,
    val firstName: String,
    val lastName: String,
    val emailVerified: Boolean
)