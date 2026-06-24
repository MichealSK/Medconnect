package com.medconnect.backend.symptom

import com.medconnect.backend.appointment.AppointmentRepository
import com.medconnect.backend.appointment.AppointmentStatus
import com.medconnect.backend.shared.exception.BadRequestException
import com.medconnect.backend.shared.exception.ConflictException
import com.medconnect.backend.shared.exception.ForbiddenException
import com.medconnect.backend.shared.exception.NotFoundException
import com.medconnect.backend.shared.extension.currentUser
import com.medconnect.backend.symptom.dto.SymptomFormRequest
import com.medconnect.backend.symptom.dto.SymptomFormResponse
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class SymptomService(
    private val symptomRepository: SymptomRepository,
    private val appointmentRepository: AppointmentRepository,
    private val aiService: AiService
) {
    @Transactional
    fun submitFrom(appointmentId: UUID, request: SymptomFormRequest): SymptomFormResponse {
        val patient = currentUser()

        val appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow { NotFoundException("Appointment not found") }
        if (appointment.patient.id != patient.id)
            throw ForbiddenException("You can only submit form for your own appointments")
        if (appointment.status == AppointmentStatus.CANCELLED)
            throw BadRequestException("This appointment is canceled")
        if (symptomRepository.existsByAppointmentId((appointmentId)))
            throw ConflictException("Symptom form already submitted")
        val form = SymptomForm(
            appointment = appointment,
            symptomsText = request.symptomsText,
            durationDays = request.durationDays,
            severity = request.severity,
            medications = request.medications,
            knownConditions = request.knownConditions
        )
        val savedForm = symptomRepository.save(form)
        generateBriefAsync(savedForm.id!!)
        return SymptomFormResponse.from(savedForm)
    }

    @Async
    @Transactional
    fun generateBriefAsync(formId: UUID) {
        val form = symptomRepository.findById(formId).orElse(null) ?: return
        val brief = aiService.generateBrief(form)
        form.aiBrief = brief
        symptomRepository.save(form)
    }

    @Transactional
    fun getForm(appointmentId: UUID): SymptomFormResponse {
        val user = currentUser()

        val appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow { NotFoundException("Appointment not found") }
        val isPatient = appointment.patient.id == user.id
        val isDoctor = appointment.doctor.user.id == user.id
        if (!isPatient && !isDoctor)
            throw ForbiddenException("You are not participant of this appointment")
        val form = symptomRepository.findByAppointmentId(appointmentId)
            ?: throw NotFoundException("Symptom form not found")
        return SymptomFormResponse.from(form)
    }

}