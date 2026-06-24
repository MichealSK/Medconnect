package com.medconnect.backend.stats

import com.medconnect.backend.review.ReviewRepository
import com.medconnect.backend.user.Role
import com.medconnect.backend.user.UserRepository
import org.springframework.stereotype.Service

@Service
class StatsService(
    private val userRepository: UserRepository,
    private val reviewRepository: ReviewRepository
) {
    fun getPlatformStats(): StatsResponse {
        return StatsResponse(
            doctorCount = userRepository.countByRole(Role.DOCTOR),
            patientCount = userRepository.countByRole(Role.PATIENT),
            averageDoctorRating = reviewRepository.getOverallAverageRating()
        )
    }
}