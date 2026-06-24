package com.medconnect.backend.doctor.availability

import com.medconnect.backend.doctor.dto.AvailabilitySlotRequest
import com.medconnect.backend.doctor.dto.AvailabilitySlotResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/doctors/{doctorId}/slots")
class AvailabilityController(private val availabilityService: AvailabilityService) {
    @GetMapping
    fun getSlots(@PathVariable doctorId: UUID) = availabilityService.getSlots(doctorId)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun addSlot(
        @PathVariable doctorId: UUID, @Valid @RequestBody request: AvailabilitySlotRequest
    ) = availabilityService.addSlot(doctorId, request)

    @GetMapping("/booked")
    fun getBookedSlots(@PathVariable doctorId: UUID) = availabilityService.getBookedSlots(doctorId)

    @DeleteMapping("/{slotId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteSlot(@PathVariable doctorId: UUID, @PathVariable slotId: UUID) =
        availabilityService.deleteSlot(doctorId, slotId)
}