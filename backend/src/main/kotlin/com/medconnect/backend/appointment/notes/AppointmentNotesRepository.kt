package com.medconnect.backend.appointment.notes

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface AppointmentNotesRepository : JpaRepository<AppointmentNotes, UUID> {
    fun findByAppointmentId(appointmentId: UUID): AppointmentNotes?
    fun existsByAppointmentId(appointmentId: UUID): Boolean
}