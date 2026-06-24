package com.medconnect.backend.doctor.dto

import jakarta.validation.constraints.NotBlank

data class DoctorProfileRequest(
    @field:NotBlank val specialty: String,
    val bio: String? = null,
    val languages: List<String> = emptyList(),
    val timezone: String = "UTC",
    val yearsExperience: Int? = null,
    val profilePhotoUrl: String? = null
)