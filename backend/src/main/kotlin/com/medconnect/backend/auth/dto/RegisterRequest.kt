package com.medconnect.backend.auth.dto

import com.medconnect.backend.user.Role
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @field:NotBlank @field:Email val email: String,
    @field:NotBlank @field:Size(min = 8) val password: String,
    @field:NotBlank val firstName: String,
    @field:NotBlank val lastName: String,
    val role: Role = Role.PATIENT
)