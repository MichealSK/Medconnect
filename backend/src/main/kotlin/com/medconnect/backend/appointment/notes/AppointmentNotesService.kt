package com.medconnect.backend.appointment.notes

import com.medconnect.backend.appointment.Appointment
import com.medconnect.backend.appointment.AppointmentRepository
import com.medconnect.backend.appointment.notes.dto.AppointmentNotesRequest
import com.medconnect.backend.appointment.notes.dto.AppointmentNotesResponse
import com.medconnect.backend.shared.exception.*
import com.medconnect.backend.shared.extension.currentUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class AppointmentNotesService(
    private val appointmentRepository: AppointmentRepository,
    private val appointmentNotesRepository: AppointmentNotesRepository
) {

    fun saveNotes(appointmentId: UUID, request: AppointmentNotesRequest): AppointmentNotesResponse {
        val doctor = currentUser()

        val appointment = findAppointmentById(appointmentId)

        if (appointment.doctor.user.id != doctor.id) throw ForbiddenException("You can only write notes for your own appointments")

        if (appointmentNotesRepository.existsByAppointmentId(appointmentId)) throw ConflictException("Notes already exist for this appointment")

        val notes = AppointmentNotes(
            appointment = appointment, doctor = doctor, notesText = request.notesText
        )

        return AppointmentNotesResponse.from(appointmentNotesRepository.save(notes))
    }

    fun getNotes(appointmentId: UUID): AppointmentNotesResponse {
        val appointment = findAppointmentById(appointmentId)
        validateParticipant(appointment)

        val notes = appointmentNotesRepository.findByAppointmentId(appointmentId)
            ?: throw NotFoundException("Notes not found for this appointment")

        return AppointmentNotesResponse.from(notes)
    }

    private fun findAppointmentById(id: UUID): Appointment =
        appointmentRepository.findById(id).orElseThrow { NotFoundException("Appointment not found") }

    private fun validateParticipant(appointment: Appointment) {
        val user = currentUser()
        val isPatient = appointment.patient.id == user.id
        val isDoctor = appointment.doctor.user.id == user.id

        if (!isPatient && !isDoctor) throw ForbiddenException("You are not a participant of this appointment")
    }
}