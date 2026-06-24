package com.medconnect.backend.appointment.dto

import com.medconnect.backend.appointment.Appointment
import com.medconnect.backend.appointment.AppointmentStatus
import java.time.Instant
import java.util.UUID

data class AppointmentResponse(
    val id: UUID,
    val patientId: UUID,
    val patientName: String,
    val doctorId: UUID,
    val doctorName: String,
    val specialty: String,
    val scheduledAt: Instant,
    val durationMinutes: Int,
    val status: AppointmentStatus,
    val jitsiRoom: String?,
    val jitsiUrl: String?,
    val createdAt: Instant
) {
    companion object {
        fun from(appointment: Appointment) = AppointmentResponse(
            id = appointment.id!!,
            patientId = appointment.patient.id!!,
            patientName = appointment.patient.fullName,
            doctorId = appointment.doctor.id!!,
            doctorName = appointment.doctor.user.fullName,
            specialty = appointment.doctor.specialty,
            scheduledAt = appointment.scheduledAt,
            durationMinutes = appointment.durationMinutes,
            status = appointment.status,
            jitsiRoom = appointment.jitsiRoom,
            jitsiUrl = appointment.jitsiRoom?.let { "https://meet.jit.si/$it" },
            createdAt = appointment.createdAt
        )
    }
}