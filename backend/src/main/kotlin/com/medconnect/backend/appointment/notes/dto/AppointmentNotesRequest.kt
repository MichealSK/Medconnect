package com.medconnect.backend.appointment.notes.dto

import jakarta.validation.constraints.NotBlank

data class AppointmentNotesRequest(
    @field:NotBlank val notesText: String
)