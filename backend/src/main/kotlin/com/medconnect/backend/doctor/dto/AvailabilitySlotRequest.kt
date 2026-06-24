package com.medconnect.backend.doctor.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import java.time.LocalTime

data class AvailabilitySlotRequest(
    @field:Min(0) @field:Max(6) val dayOfWeek: Int,
    val startTime: LocalTime,
    val endTime: LocalTime
)