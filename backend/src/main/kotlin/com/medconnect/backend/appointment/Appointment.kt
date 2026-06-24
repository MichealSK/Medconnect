package com.medconnect.backend.appointment

import com.medconnect.backend.doctor.DoctorProfile
import com.medconnect.backend.user.User
import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "appointments")
class Appointment(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    val patient: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    val doctor: DoctorProfile,

    @Column(name = "scheduled_at", nullable = false)
    val scheduledAt: Instant,

    @Column(name = "duration_minutes", nullable = false)
    val durationMinutes: Int = 30,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: AppointmentStatus = AppointmentStatus.PENDING,

    @Column(name = "jitsi_room")
    val jitsiRoom: String? = null,

    @Column(name = "reminder_24h_sent", nullable = false)
    var reminder24hSent: Boolean = false,

    @Column(name = "reminder_1h_sent", nullable = false)
    var reminder1hSent: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
)