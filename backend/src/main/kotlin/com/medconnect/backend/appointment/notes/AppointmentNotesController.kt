package com.medconnect.backend.appointment.notes

import com.medconnect.backend.appointment.notes.dto.*
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/appointments/{appointmentId}/notes")
class AppointmentNotesController(
    private val appointmentNotesService: AppointmentNotesService
) {
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun saveNotes(
        @PathVariable appointmentId: UUID,
        @Valid @RequestBody request: AppointmentNotesRequest
    ) = appointmentNotesService.saveNotes(appointmentId, request)

    @GetMapping
    fun getNotes(@PathVariable appointmentId: UUID) =
        appointmentNotesService.getNotes(appointmentId)
}