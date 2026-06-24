package com.medconnect.backend.email

import com.medconnect.backend.config.properties.AppProperties
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val mailSender: JavaMailSender,
    private val appProperties: AppProperties,
    @Value("\${spring.mail.username:}") private val mailUsername: String,
    @Value("\${spring.mail.password:}") private val mailPassword: String,
    @Value("\${spring.mail.properties.mail.smtp.auth:false}") private val smtpAuth: Boolean,
    @Value("\${spring.mail.host:}") private val mailHost: String,
    @Value("\${spring.mail.port:0}") private val mailPort: Int
) {
    private val log = LoggerFactory.getLogger(EmailService::class.java)

    fun sendVerificationEmail(to: String, token: String) {
        val link = "${appProperties.frontendUrl}/auth/verify?token=$token"
        send(
            to = to,
            subject = "Verify your MedConnect account",
            body = """
                Welcome to MedConnect!
                Please verify your email address by clicking the link below:
                
                $link
                
                This link expires in 24 hours.
            """.trimIndent(),
            fallbackLink = link
        )
    }

    fun sendPasswordResetEmail(to: String, token: String) {
        val link = "${appProperties.frontendUrl}/auth/reset-password?token=$token"
        send(
            to = to,
            subject = "Reset your MedConnect password",
            body = """
                You requested a password reset.
                
                Click the link below to set a new password:
                $link
                
                This link expires in 1 hour.
                If you did not request this, ignore this email.
            """.trimIndent(),
            fallbackLink = link
        )
    }

    fun sendBookingConfirmation(to: String, doctorName: String, scheduledAt: String, jitsiUrl: String) {
        send(
            to = to,
            subject = "Appointment confirmed - MedConnect",
            body = """
                Your appointment has been confirmed.
                
                Doctor: $doctorName
                Date & Time: $scheduledAt
                
                Join your video consultation at this link:
                
                $jitsiUrl
                
                You will receive a reminder 24 hours before the appointment as well as 1 hour before the appointment.
            """.trimIndent(),
            fallbackLink = jitsiUrl
        )
    }

    fun sendCancellationEmail(to: String, doctorName: String, scheduledAt: String) {
        send(
            to = to,
            subject = "Appointment cancelled - MedConnect",
            body = """
                Your appointment has been cancelled. 
                
                Doctor: $doctorName
                Date & Time: $scheduledAt
                
                You can book a new appointment at any time on MedConnect.
            """.trimIndent()
        )
    }

    fun sendReminderEmail(to: String, doctorName: String, scheduledAt: String, jitsiUrl: String) {
        send(
            to = to,
            subject = "Appointment reminder - MedConnect",
            body = """
                Reminder: you have an upcoming appointment.
                
                Doctor: $doctorName
                Date & Time: $scheduledAt
                
                Join your video consultation:
                $jitsiUrl
            """.trimIndent(),
            fallbackLink = jitsiUrl
        )
    }

    private fun send(to: String, subject: String, body: String, fallbackLink: String? = null) {
        if (!appProperties.mailEnabled) {
            log.warn(
                "Email delivery is disabled. Skipping email '{}' to {}.{}",
                subject,
                to,
                fallbackLink?.let { " Link: $it" } ?: ""
            )
            return
        }

        if (smtpAuth && (mailUsername.isBlank() || mailPassword.isBlank())) {
            log.warn(
                "SMTP authentication is enabled, but MAIL_USERNAME or MAIL_PASSWORD is missing. Skipping email '{}' to {}.{}",
                subject,
                to,
                fallbackLink?.let { " Link: $it" } ?: ""
            )
            return
        }

        val message = SimpleMailMessage().apply {
            from = appProperties.mailFrom
            setTo(to)
            this.subject = subject
            text = body
        }

        runCatching { mailSender.send(message) }
            .onSuccess { log.info("Email '{}' sent to {} through {}:{}", subject, to, mailHost, mailPort) }
            .onFailure { ex ->
                log.error(
                    "Email '{}' could not be sent to {} through {}:{}. Continuing without rolling back the application action.{}",
                    subject,
                    to,
                    mailHost,
                    mailPort,
                    fallbackLink?.let { " Link: $it" } ?: "",
                    ex
                )
            }
    }
}
