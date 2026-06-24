package com.medconnect.backend.doctor

import com.medconnect.backend.doctor.dto.DoctorProfileRequest
import com.medconnect.backend.review.ReviewService
import com.medconnect.backend.review.dto.ReviewRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/doctors")
class DoctorController(private val doctorService: DoctorService, private val reviewService: ReviewService) {

    @GetMapping
    fun getAllDoctors(
        @RequestParam(required = false) specialty: String?, @RequestParam(required = false) language: String?
    ) = doctorService.getAllDoctors(specialty, language)

    @GetMapping("/pageable")
    fun getAllDoctorsPaged(
        @RequestParam(required = false) specialty: String?,
        @RequestParam(required = false) language: String?,
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "9") size: Int
    ) = doctorService.getAllDoctorsPaged(specialty, language, search, page, size)

    @GetMapping("/{doctorId}")
    fun getDoctorById(@PathVariable doctorId: UUID) = doctorService.getDoctorById(doctorId)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createProfile(@Valid @RequestBody request: DoctorProfileRequest) = doctorService.createProfile(request)

    @PutMapping("/{doctorId}")
    fun updateProfile(
        @PathVariable doctorId: UUID, @Valid @RequestBody request: DoctorProfileRequest
    ) = doctorService.updateProfile(doctorId, request)

    @GetMapping("/me")
    fun getMyProfile() = doctorService.getMyProfile()

    @PostMapping("/{doctorId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    fun submitReview(
        @PathVariable doctorId: UUID, @Valid @RequestBody request: ReviewRequest
    ) = reviewService.submitReview(doctorId, request)

    @GetMapping("/{doctorId}/reviews")
    fun getDoctorReviews(@PathVariable doctorId: UUID) = reviewService.getDoctorReviews(doctorId)

}