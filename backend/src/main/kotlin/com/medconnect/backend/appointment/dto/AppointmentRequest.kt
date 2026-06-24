package com.medconnect.backend.appointment.dto

import jakarta.validation.constraints.Future
import jakarta.validation.constraints.NotNull
import java.time.Instant
import java.util.UUID

data class AppointmentRequest(
    @field:NotNull var doctorId: UUID,
    @field:NotNull @field:Future var scheduledAt: Instant,
    val durationMinutes: Int = 30
)