package com.medconnect.backend.doctor.availability

import com.medconnect.backend.appointment.AppointmentRepository
import com.medconnect.backend.appointment.AppointmentStatus
import com.medconnect.backend.doctor.DoctorRepository
import com.medconnect.backend.doctor.dto.AvailabilitySlotRequest
import com.medconnect.backend.doctor.dto.AvailabilitySlotResponse
import com.medconnect.backend.shared.exception.ForbiddenException
import com.medconnect.backend.shared.exception.NotFoundException
import com.medconnect.backend.shared.extension.currentUser
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.util.UUID

@Service
@Transactional
class AvailabilityService(
    private val availabilityRepository: AvailabilityRepository,
    private val doctorRepository: DoctorRepository,
    private val appointmentRepository: AppointmentRepository
) {
    fun getSlots(doctorId: UUID): List<AvailabilitySlotResponse> {
        val profile = doctorRepository.findById(doctorId)
            .orElseThrow { NotFoundException("Doctor not found") }
        return availabilityRepository.findByDoctorIdAndIsActiveTrue(profile.id!!)
            .map { AvailabilitySlotResponse.from(it) }
    }

    fun addSlot(doctorId: UUID, request: AvailabilitySlotRequest): AvailabilitySlotResponse {
        val currentUser = currentUser()

        val profile = doctorRepository.findById(doctorId).orElseThrow { NotFoundException("Doctor not found") }
        if (profile.user.id != currentUser.id) throw ForbiddenException("You can only add slots to your own profile")

        val overlapping = availabilityRepository
            .findByDoctorIdAndDayOfWeek(profile.id!!, request.dayOfWeek)
            .any { it.isActive && it.startTime < request.endTime && it.endTime > request.startTime }

        if (overlapping) throw ForbiddenException("Slot overlaps with an existing slot")

        val slot = AvailabilitySlot(
            doctor = profile,
            dayOfWeek = request.dayOfWeek,
            startTime = request.startTime,
            endTime = request.endTime
        )
        return AvailabilitySlotResponse.from(availabilityRepository.save(slot))
    }

    fun getBookedSlots(doctorId: UUID): List<String> {
        val profile = doctorRepository.findById(doctorId)
            .orElseThrow { NotFoundException("Doctor not found") }
        return appointmentRepository.findByDoctorId(profile.id!!)
            .filter { it.status == AppointmentStatus.CONFIRMED }
            .map { it.scheduledAt.toString() }
    }

    fun deleteSlot(doctorId: UUID, slotId: UUID) {
        val currentUser = currentUser()
        val profile = doctorRepository.findById(doctorId)
            .orElseThrow { NotFoundException("Doctor not found") }
        if (profile.user.id != currentUser.id) throw ForbiddenException("You can only delete slots to your own profile")
        val slot = availabilityRepository.findById(slotId)
            .orElseThrow { NotFoundException("Slot not found") }
        slot.isActive = false

    }
}