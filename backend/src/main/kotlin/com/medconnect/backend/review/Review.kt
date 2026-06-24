package com.medconnect.backend.review

import com.medconnect.backend.appointment.Appointment
import com.medconnect.backend.doctor.DoctorProfile
import com.medconnect.backend.user.User
import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "reviews")
class Review(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    val appointment: Appointment,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    val patient: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    val doctor: DoctorProfile,

    @Column(nullable = false)
    val rating: Int,

    @Column(columnDefinition = "TEXT")
    val comment: String? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
)