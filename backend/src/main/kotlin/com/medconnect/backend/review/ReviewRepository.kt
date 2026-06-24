package com.medconnect.backend.review

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface ReviewRepository : JpaRepository<Review, UUID> {
    fun findByDoctorId(doctorId: UUID): List<Review>
    fun existsByAppointmentId(appointmentId: UUID): Boolean
    fun countByDoctorId(doctorId: UUID): Int

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctor.id = :doctorId")
    fun getAverageRating(doctorId: UUID): Double?

    @Query("SELECT AVG(r.rating) FROM Review r")
    fun getOverallAverageRating(): Double?
}