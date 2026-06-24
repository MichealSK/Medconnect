package com.medconnect.backend.doctor.dto

import com.medconnect.backend.doctor.availability.AvailabilitySlot
import java.time.LocalTime
import java.util.UUID

data class AvailabilitySlotResponse(
    val id: UUID,
    val doctorId: UUID,
    val dayOfWeek: Int,
    val startTime: LocalTime,
    val endTime: LocalTime,
    val isActive: Boolean
) {
    companion object {
        fun from(slot: AvailabilitySlot) = AvailabilitySlotResponse(
            id = slot.id!!,
            doctorId = slot.doctor.id!!,
            dayOfWeek = slot.dayOfWeek,
            startTime = slot.startTime,
            endTime = slot.endTime,
            isActive = slot.isActive
        )
    }
}