package com.medconnect.backend.doctor.availability

import com.medconnect.backend.doctor.DoctorProfile
import jakarta.persistence.*
import java.time.LocalTime
import java.util.UUID

@Entity
@Table(name = "availability_slots")
class AvailabilitySlot(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    val doctor: DoctorProfile,

    @Column(nullable = false)
    val dayOfWeek: Int,

    @Column(nullable = false)
    val startTime: LocalTime,

    @Column(nullable = false)
    val endTime: LocalTime,

    @Column(nullable = false)
    var isActive: Boolean = true
)