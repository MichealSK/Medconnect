package com.medconnect.backend.appointment.notes

import com.medconnect.backend.appointment.Appointment
import com.medconnect.backend.user.User
import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "appointment_notes")
class AppointmentNotes(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    val appointment: Appointment,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    val doctor: User,

    @Column(nullable = false, columnDefinition = "TEXT")
    val notesText: String,

    @Column(nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
)