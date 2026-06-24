package com.medconnect.backend.doctor

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.UUID

interface DoctorRepository : JpaRepository<DoctorProfile, UUID> {
    fun findByUserId(userId: UUID): DoctorProfile?
    fun existsByUserId(userId: UUID): Boolean
    fun findBySpecialtyContainingIgnoreCase(specialty: String): List<DoctorProfile>

    @Query("SELECT * FROM doctor_profiles WHERE :language = ANY(languages)", nativeQuery = true)
    fun findByLanguage(language: String): List<DoctorProfile>
}
