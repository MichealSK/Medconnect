package com.medconnect.backend.appointment

import com.medconnect.backend.appointment.dto.*
import com.medconnect.backend.doctor.DoctorRepository
import com.medconnect.backend.email.EmailService
import com.medconnect.backend.notification.NotificationService
import com.medconnect.backend.shared.exception.*
import com.medconnect.backend.shared.extension.currentUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class AppointmentService(
    private val appointmentRepository: AppointmentRepository,
    private val doctorRepository: DoctorRepository,
    private val notificationService: NotificationService,
    private val emailService: EmailService
) {

    fun book(request: AppointmentRequest): AppointmentResponse {
        val patient = currentUser()

        val doctor = doctorRepository.findById(request.doctorId)
            .orElseThrow { NotFoundException("Doctor not found") }

        val endTime = request.scheduledAt.plusSeconds(request.durationMinutes * 60L)

        if (appointmentRepository.existsOverlappingAppointment(doctor.id!!, request.scheduledAt, endTime))
            throw ConflictException("This slot is already booked")

        val jitsiRoom = "medconnect-${UUID.randomUUID()}"

        val appointment = Appointment(
            patient = patient,
            doctor = doctor,
            scheduledAt = request.scheduledAt,
            durationMinutes = request.durationMinutes,
            status = AppointmentStatus.CONFIRMED,
            jitsiRoom = jitsiRoom
        )
        val saved = appointmentRepository.save(appointment)
        val jitsiUrl = "https://meet.jit.si/${saved.jitsiRoom}"

        notificationService.createNotification(
            user = saved.patient,
            type = "BOOKING_CONFIRMED",
            message = "Your appointment with Dr. ${saved.doctor.user.fullName} on ${saved.scheduledAt} is confirmed."
        )
        notificationService.createNotification(
            user = saved.doctor.user,
            type = "BOOKING_CONFIRMED",
            message = "New appointment booked by ${saved.patient.fullName} on ${saved.scheduledAt}."
        )
        emailService.sendBookingConfirmation(
            to = saved.patient.email,
            doctorName = "Dr. ${saved.doctor.user.fullName}",
            scheduledAt = saved.scheduledAt.toString(),
            jitsiUrl = jitsiUrl
        )
        emailService.sendBookingConfirmation(
            to = saved.doctor.user.email,
            doctorName = "Dr. ${saved.doctor.user.fullName}",
            scheduledAt = saved.scheduledAt.toString(),
            jitsiUrl = jitsiUrl
        )
        return AppointmentResponse.from(saved)
    }

    fun getMyAppointments(): List<AppointmentResponse> {
        val user = currentUser()
        return when (user.role.name) {
            "DOCTOR" -> {
                val profile = doctorRepository.findByUserId(user.id!!)
                    ?: throw NotFoundException("Doctor profile not found")
                appointmentRepository.findByDoctorId(profile.id!!)
                    .map { AppointmentResponse.from(it) }
            }

            else -> appointmentRepository.findByPatientId(user.id!!)
                .map { AppointmentResponse.from(it) }
        }
    }

    fun getById(id: UUID): AppointmentResponse {
        val appointment = findAppointmentById(id)
        validateParticipant(appointment)
        return AppointmentResponse.from(appointment)
    }

    fun cancel(id: UUID) {
        val appointment = findAppointmentById(id)
        validateParticipant(appointment)

        if (appointment.status == AppointmentStatus.COMPLETED)
            throw ConflictException("Cannot cancel a completed appointment")

        appointment.status = AppointmentStatus.CANCELLED
        notificationService.createNotification(
            user = appointment.patient,
            type = "APPOINTMENT_CANCELLED",
            message = "Your appointment with Dr. ${appointment.doctor.user.fullName} has been cancelled."
        )
        notificationService.createNotification(
            user = appointment.doctor.user,
            type = "APPOINTMENT_CANCELLED",
            message = "Appointment with ${appointment.patient.fullName} has been cancelled."
        )
        emailService.sendCancellationEmail(
            to = appointment.patient.email,
            doctorName = "Dr. ${appointment.doctor.user.fullName}",
            scheduledAt = appointment.scheduledAt.toString()
        )
        emailService.sendCancellationEmail(
            to = appointment.doctor.user.email,
            doctorName = "Dr. ${appointment.patient.fullName}",
            scheduledAt = appointment.scheduledAt.toString()
        )
    }

    private fun findAppointmentById(id: UUID): Appointment =
        appointmentRepository.findById(id)
            .orElseThrow { NotFoundException("Appointment not found") }

    private fun validateParticipant(appointment: Appointment) {
        val user = currentUser()
        val isPatient = appointment.patient.id == user.id
        val isDoctor = appointment.doctor.user.id == user.id

        if (!isPatient && !isDoctor)
            throw ForbiddenException("You are not a participant of this appointment")
    }
}