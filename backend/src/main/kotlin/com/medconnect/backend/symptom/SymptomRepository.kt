package com.medconnect.backend.symptom

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SymptomRepository : JpaRepository<SymptomForm, UUID> {
    fun findByAppointmentId(appointmentId: UUID): SymptomForm?
    fun existsByAppointmentId(appointmentId: UUID): Boolean
}