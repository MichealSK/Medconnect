package com.medconnect.backend.symptom.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class SymptomFormRequest(
    @field:NotBlank val symptomsText: String,
    val durationDays: Int? = null,
    @field:Min(1) @field:Max(10) val severity: Int? = null,
    val medications: String? = null,
    val knownConditions: String? = null
)