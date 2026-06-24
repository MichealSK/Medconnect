package com.medconnect.backend.review.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.util.UUID

data class ReviewRequest(
    @field:NotNull var appointmentId: UUID,
    @field:NotNull @field:Min(1) @field:Max(5) var rating: Int,
    var comment: String? = null
)