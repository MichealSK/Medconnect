package com.medconnect.backend.symptom.dto

import com.medconnect.backend.symptom.SymptomForm
import java.time.Instant
import java.util.UUID

data class SymptomFormResponse(
    val id: UUID,
    val appointmentId: UUID,
    val symptomsText: String,
    val durationDays: Int?,
    val severity: Int?,
    val medications: String?,
    val knownConditions: String?,
    val aiBrief: String?,
    val createdAt: Instant
) {
    companion object {
        fun from(form: SymptomForm) = SymptomFormResponse(
            id = form.id!!,
            appointmentId = form.appointment.id!!,
            symptomsText = form.symptomsText,
            durationDays = form.durationDays,
            severity = form.severity,
            medications = form.medications,
            knownConditions = form.knownConditions,
            aiBrief = form.aiBrief,
            createdAt = form.createdAt
        )
    }
}