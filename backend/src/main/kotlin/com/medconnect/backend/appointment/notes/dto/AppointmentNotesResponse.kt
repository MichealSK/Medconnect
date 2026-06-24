package com.medconnect.backend.appointment.notes.dto

import com.medconnect.backend.appointment.notes.AppointmentNotes
import java.time.Instant
import java.util.UUID

data class AppointmentNotesResponse(
    val id: UUID,
    val appointmentId: UUID,
    val doctorId: UUID,
    val doctorName: String,
    val notesText: String,
    val createdAt: Instant
) {
    companion object {
        fun from(notes: AppointmentNotes) = AppointmentNotesResponse(
            id = notes.id!!,
            appointmentId = notes.appointment.id!!,
            doctorId = notes.doctor.id!!,
            doctorName = notes.doctor.fullName,
            notesText = notes.notesText,
            createdAt = notes.createdAt
        )
    }
}