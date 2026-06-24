package com.medconnect.backend.auth.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class DoctorRegisterRequest(
    @field:NotBlank @field:Email val email: String,
    @field:NotBlank @field:Size(min = 8) val password: String,
    @field:NotBlank val firstName: String,
    @field:NotBlank val lastName: String,
    @field:NotBlank val specialty: String,
    val languages: List<String> = emptyList(),
    val yearsExperience: Int? = null,
    val bio: String? = null,
    val timezone: String = "UTC"
)