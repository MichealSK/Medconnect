package com.medconnect.backend.doctor.dto

import com.medconnect.backend.doctor.DoctorProfile
import java.util.UUID

data class DoctorProfileResponse(
    val id: UUID,
    val userId: UUID,
    val firstName: String,
    val lastName: String,
    val email: String,
    val specialty: String,
    val bio: String?,
    val languages: List<String>,
    val timezone: String,
    val yearsExperience: Int?,
    val profilePhotoUrl: String?,
    val averageRating: Double,
    val reviewCount: Int
) {
    companion object {
        fun from(profile: DoctorProfile) = DoctorProfileResponse(
            id = profile.id!!,
            userId = profile.user.id!!,
            firstName = profile.user.firstName,
            lastName = profile.user.lastName,
            email = profile.user.email,
            specialty = profile.specialty,
            bio = profile.bio,
            languages = profile.languages.toList(),
            timezone = profile.timezone,
            yearsExperience = profile.yearsExperience,
            profilePhotoUrl = profile.profilePhotoUrl,
            averageRating = profile.averageRating,
            reviewCount = profile.reviewCount
        )
    }
}