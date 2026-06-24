package com.medconnect.backend.doctor.availability

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface AvailabilityRepository : JpaRepository<AvailabilitySlot, UUID> {
    fun findByDoctorIdAndDayOfWeek(doctorId: UUID, dayOfWeek: Int): List<AvailabilitySlot>
    fun findByDoctorIdAndIsActiveTrue(doctorId: UUID): List<AvailabilitySlot>
}