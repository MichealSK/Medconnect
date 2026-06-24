package com.medconnect.backend.symptom

import com.medconnect.backend.appointment.Appointment
import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "symptom_forms")
class SymptomForm(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    val appointment: Appointment,

    @Column(nullable = false, columnDefinition = "TEXT")
    val symptomsText: String,

    val durationDays: Int? = null,

    val severity: Int? = null,

    @Column(columnDefinition = "TEXT")
    val medications: String? = null,

    @Column(columnDefinition = "TEXT")
    val knownConditions: String? = null,

    @Column(columnDefinition = "TEXT")
    var aiBrief: String? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
)