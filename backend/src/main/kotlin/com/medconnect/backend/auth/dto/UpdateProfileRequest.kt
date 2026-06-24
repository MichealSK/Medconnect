package com.medconnect.backend.auth.dto

import jakarta.validation.constraints.NotBlank

data class UpdateProfileRequest(
    @field:NotBlank val firstName: String,
    @field:NotBlank val lastName: String
)