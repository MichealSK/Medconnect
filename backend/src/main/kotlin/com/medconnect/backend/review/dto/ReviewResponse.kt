package com.medconnect.backend.review.dto

import com.medconnect.backend.review.Review
import java.time.Instant
import java.util.UUID

data class ReviewResponse(
    val id: UUID,
    val appointmentId: UUID,
    val patientName: String,
    val doctorId: UUID,
    val rating: Int,
    val comment: String?,
    val createdAt: Instant
) {
    companion object {
        fun from(review: Review) = ReviewResponse(
            id = review.id!!,
            appointmentId = review.appointment.id!!,
            patientName = review.patient.fullName,
            doctorId = review.doctor.id!!,
            rating = review.rating,
            comment = review.comment,
            createdAt = review.createdAt
        )
    }
}