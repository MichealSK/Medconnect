package com.medconnect.backend.config

import com.medconnect.backend.appointment.AppointmentRepository
import com.medconnect.backend.appointment.AppointmentStatus
import com.medconnect.backend.auth.token.PasswordResetTokenRepository
import com.medconnect.backend.auth.token.VerificationTokenRepository
import com.medconnect.backend.email.EmailService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Component
class ReminderScheduler(
    private val appointmentRepository: AppointmentRepository,
    private val emailService: EmailService,
    private val verificationTokenRepository: VerificationTokenRepository,
    private val passwordResetTokenRepository: PasswordResetTokenRepository
) {

    @Scheduled(fixedRate = 60_000)
    @Transactional
    fun sendReminders() {
        val now = Instant.now()

        val in24h = now.plusSeconds(24 * 60 * 60)
        appointmentRepository.findDueFor24hReminder(in24h, in24h.plusSeconds(60)).forEach { appointment ->
            sendReminderEmails(appointment)
            appointment.reminder24hSent = true
        }

        val in1h = now.plusSeconds(60 * 60)
        appointmentRepository.findDueFor1hReminder(in1h, in1h.plusSeconds(60)).forEach { appointment ->
            sendReminderEmails(appointment)
            appointment.reminder1hSent = true
        }
    }

    private fun sendReminderEmails(appointment: com.medconnect.backend.appointment.Appointment) {
        val jitsiUrl = "https://meet.jit.si/${appointment.jitsiRoom}"
        val scheduledAt = appointment.scheduledAt.toString()
        val doctorName = "Dr. ${appointment.doctor.user.fullName}"

        emailService.sendReminderEmail(
            to = appointment.patient.email, doctorName = doctorName, scheduledAt = scheduledAt, jitsiUrl = jitsiUrl
        )
        emailService.sendReminderEmail(
            to = appointment.doctor.user.email, doctorName = doctorName, scheduledAt = scheduledAt, jitsiUrl = jitsiUrl
        )
    }

    @Scheduled(cron = "0 0 3 * * MON")
    @Transactional
    fun cleanupExpiredTokens() {
        val now = Instant.now()
        verificationTokenRepository.deleteAllByExpiresAtBefore(now)
        passwordResetTokenRepository.deleteAllByExpiresAtBefore(now)
    }

    @Scheduled(fixedRate = 60_000)
    @Transactional
    fun completePassedAppointments() {
        val now = Instant.now()
        appointmentRepository.findByStatusAndScheduledAtBefore(AppointmentStatus.CONFIRMED, now)
            .forEach { appointment ->
                val endTime = appointment.scheduledAt.plusSeconds(appointment.durationMinutes * 60L)
                if (endTime.isBefore(now)) {
                    appointment.status = AppointmentStatus.COMPLETED
                }
            }
    }
}