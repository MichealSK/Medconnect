package com.medconnect.backend.stats

data class StatsResponse(
    val doctorCount: Long,
    val patientCount: Long,
    val averageDoctorRating: Double?
)