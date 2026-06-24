package com.medconnect.backend.doctor

import com.medconnect.backend.doctor.dto.DoctorProfileRequest
import com.medconnect.backend.doctor.dto.DoctorProfileResponse
import com.medconnect.backend.shared.exception.ForbiddenException
import com.medconnect.backend.shared.exception.NotFoundException
import com.medconnect.backend.shared.extension.currentUser
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import java.util.UUID

@Service
@Transactional
class DoctorService(
    private val doctorRepository: DoctorRepository
) {

    fun getAllDoctors(specialty: String?, language: String?): List<DoctorProfileResponse> {
        return when {
            specialty != null && language != null ->
                doctorRepository.findBySpecialtyContainingIgnoreCase(specialty)
                    .filter { it.languages.contains(language) }

            specialty != null ->
                doctorRepository.findBySpecialtyContainingIgnoreCase(specialty)

            language != null ->
                doctorRepository.findByLanguage(language)

            else ->
                doctorRepository.findAll()
        }.map { DoctorProfileResponse.from(it) }
    }

    fun getAllDoctorsPaged(
        specialty: String?,
        language: String?,
        search: String?,
        page: Int,
        size: Int
    ): Page<DoctorProfileResponse> {
        val pageable = PageRequest.of(page, size)
        val all = when {
            specialty != null ->
                doctorRepository.findBySpecialtyContainingIgnoreCase(specialty)

            language != null ->
                doctorRepository.findByLanguage(language)

            else ->
                doctorRepository.findAll()
        }
        val filtered = all
            .filter { specialty == null || it.specialty.contains(specialty, ignoreCase = true) }
            .filter { language == null || it.languages.contains(language) }
            .filter {
                search == null ||
                        it.user.firstName.contains(search, ignoreCase = true) ||
                        it.user.lastName.contains(search, ignoreCase = true) ||
                        it.specialty.contains(search, ignoreCase = true)
            }
            .map { DoctorProfileResponse.from(it) }

        val start = (page * size).coerceAtMost(filtered.size)
        val end = (start + size).coerceAtMost(filtered.size)
        return PageImpl(filtered.subList(start, end), pageable, filtered.size.toLong())
    }

    fun getDoctorById(id: UUID): DoctorProfileResponse {
        val profile = doctorRepository.findById(id)
            .orElseThrow { NotFoundException("Doctor not found!") }
        return DoctorProfileResponse.from(profile)
    }

    fun updateProfile(id: UUID, request: DoctorProfileRequest): DoctorProfileResponse {
        val currentUser = currentUser()
        val profile = doctorRepository.findById(id)
            .orElseThrow { NotFoundException("Doctor not found!") }
        if (profile.user.id != currentUser.id) throw ForbiddenException("You can only update your profile!")

        profile.specialty = request.specialty
        profile.bio = request.bio
        profile.timezone = request.timezone
        profile.languages = request.languages.toTypedArray()
        profile.yearsExperience = request.yearsExperience
        profile.profilePhotoUrl = request.profilePhotoUrl

        return DoctorProfileResponse.from(doctorRepository.save(profile))
    }

    fun createProfile(request: DoctorProfileRequest): DoctorProfileResponse {
        val currentUser = currentUser()
        if (doctorRepository.existsByUserId(currentUser.id!!))
            throw ForbiddenException("Profile already exists")
        val profile = DoctorProfile(
            user = currentUser,
            specialty = request.specialty,
            bio = request.bio,
            languages = request.languages.toTypedArray(),
            timezone = request.timezone,
            yearsExperience = request.yearsExperience,
            profilePhotoUrl = request.profilePhotoUrl
        )
        return DoctorProfileResponse.from(doctorRepository.save(profile))
    }

    fun getMyProfile(): DoctorProfileResponse {
        val user = currentUser()
        val profile = doctorRepository.findByUserId(user.id!!)
            ?: throw NotFoundException("Doctor profile not found")
        return DoctorProfileResponse.from(profile)
    }

}