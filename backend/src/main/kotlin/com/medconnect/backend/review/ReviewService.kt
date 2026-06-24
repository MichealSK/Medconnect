package com.medconnect.backend.review

import com.medconnect.backend.appointment.AppointmentRepository
import com.medconnect.backend.appointment.AppointmentStatus
import com.medconnect.backend.doctor.DoctorRepository
import com.medconnect.backend.review.dto.ReviewRequest
import com.medconnect.backend.review.dto.ReviewResponse
import com.medconnect.backend.shared.exception.ConflictException
import com.medconnect.backend.shared.exception.ForbiddenException
import com.medconnect.backend.shared.exception.NotFoundException
import com.medconnect.backend.shared.extension.currentUser
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.util.UUID

@Service
@Transactional
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val appointmentRepository: AppointmentRepository,
    private val doctorRepository: DoctorRepository
) {
    fun submitReview(doctorId: UUID, request: ReviewRequest): ReviewResponse {
        val patient = currentUser()

        val doctor = doctorRepository.findById(doctorId)
            .orElseThrow { NotFoundException("Doctor not found") }

        val appointment = appointmentRepository.findById(request.appointmentId)
            .orElseThrow { NotFoundException("Appointment not found") }

        if (appointment.patient.id != patient.id)
            throw ForbiddenException("You can only review your own appointments")

        if (appointment.doctor.id != doctorId)
            throw ForbiddenException("This appointment is not with this doctor")

        if (appointment.status != AppointmentStatus.COMPLETED)
            throw ConflictException("You can only review completed appointments")

        if (reviewRepository.existsByAppointmentId(request.appointmentId))
            throw ConflictException("You have already reviewed this appointment")

        val review = Review(
            appointment = appointment,
            patient = patient,
            doctor = doctor,
            rating = request.rating,
            comment = request.comment
        )

        val saved = reviewRepository.save(review)

        doctor.averageRating = reviewRepository.getAverageRating(doctor.id!!) ?: 0.0
        doctor.reviewCount = reviewRepository.countByDoctorId(doctor.id!!)
        doctorRepository.save(doctor)

        return ReviewResponse.from(saved)
    }

    fun getDoctorReviews(doctorId: UUID): List<ReviewResponse> {
        doctorRepository.findById(doctorId)
            .orElseThrow { NotFoundException("Doctor not found") }
        return reviewRepository.findByDoctorId(doctorId).map { ReviewResponse.from(it) }
    }
}