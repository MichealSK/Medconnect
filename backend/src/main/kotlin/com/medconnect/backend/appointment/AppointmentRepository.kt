package com.medconnect.backend.appointment

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.Instant
import java.util.UUID


interface AppointmentRepository : JpaRepository<Appointment, UUID> {
    fun findByPatientId(patientId: UUID): List<Appointment>
    fun findByDoctorId(doctorId: UUID): List<Appointment>

    @Query("SELECT a FROM Appointment a WHERE a.scheduledAt BETWEEN :from AND :to AND a.reminder24hSent = false AND a.status = 'CONFIRMED'")
    fun findDueFor24hReminder(from: Instant, to: Instant): List<Appointment>

    @Query("SELECT a FROM Appointment a WHERE a.scheduledAt BETWEEN :from AND :to AND a.reminder1hSent = false AND a.status = 'CONFIRMED'")
    fun findDueFor1hReminder(from: Instant, to: Instant): List<Appointment>

    @Query(
        """
    SELECT COUNT(*) > 0 FROM appointments 
    WHERE doctor_id = :doctorId 
    AND status != 'CANCELLED'
    AND scheduled_at < :endTime
    AND scheduled_at + (duration_minutes * interval '1 minute') > :startTime
""", nativeQuery = true
    )
    fun existsOverlappingAppointment(
        doctorId: UUID,
        startTime: Instant,
        endTime: Instant
    ): Boolean

    fun findByStatusAndScheduledAtBefore(status: AppointmentStatus, time: Instant): List<Appointment>

}