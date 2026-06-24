package com.medconnect.backend.symptom

import com.medconnect.backend.symptom.dto.SymptomFormRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/appointments/{appointmentId}/symptom-form")
class SymptomController(private val symptomService: SymptomService) {
    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun submitFrom(
        @PathVariable appointmentId: UUID, @Valid @RequestBody request: SymptomFormRequest
    ) = symptomService.submitFrom(appointmentId, request)

    @GetMapping
    fun getForm(@PathVariable appointmentId: UUID) = symptomService.getForm(appointmentId)
}