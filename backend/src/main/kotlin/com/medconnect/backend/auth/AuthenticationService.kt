package com.medconnect.backend.auth

import com.medconnect.backend.auth.dto.*
import com.medconnect.backend.auth.token.*
import com.medconnect.backend.config.security.JwtService
import com.medconnect.backend.doctor.DoctorProfile
import com.medconnect.backend.doctor.DoctorRepository
import com.medconnect.backend.email.EmailService
import com.medconnect.backend.shared.exception.*
import com.medconnect.backend.user.*
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
@Transactional
class AuthenticationService(
    private val userRepository: UserRepository,
    private val verificationTokenRepository: VerificationTokenRepository,
    private val passwordResetTokenRepository: PasswordResetTokenRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val authenticationManager: AuthenticationManager,
    private val emailService: EmailService,
    private val doctorRepository: DoctorRepository
) {
    fun register(request: RegisterRequest) {
        if (userRepository.existsByEmail(request.email))
            throw ConflictException("Email already in use")

        val user = userRepository.save(
            User(
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password)!!,
                role = request.role,
                firstName = request.firstName,
                lastName = request.lastName
            )
        )

        val token = VerificationToken(user = user)
        verificationTokenRepository.save(token)
        emailService.sendVerificationEmail(user.email, token.token)
    }

    fun registerDoctor(request: DoctorRegisterRequest) {
        if (userRepository.existsByEmail(request.email))
            throw ConflictException("Email already in use")

        val user = userRepository.save(
            User(
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password)!!,
                role = Role.DOCTOR,
                firstName = request.firstName,
                lastName = request.lastName
            )
        )

        doctorRepository.save(
            DoctorProfile(
                user = user,
                specialty = request.specialty,
                languages = request.languages.toTypedArray(),
                yearsExperience = request.yearsExperience,
                bio = request.bio,
                timezone = request.timezone
            )
        )

        val token = VerificationToken(user = user)
        verificationTokenRepository.save(token)
        emailService.sendVerificationEmail(user.email, token.token)
    }

    fun login(request: LoginRequest): Pair<AuthResponse, String> {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        val user = userRepository.findByEmail(request.email) ?: throw NotFoundException("User not found")

        if (!user.emailVerified)
            throw ForbiddenException("Please verify your email")
        val accessToken = jwtService.generateToken(user)
        val refreshToken = jwtService.generateRefreshToken(user)

        val response = AuthResponse(
            accessToken = accessToken,
            email = user.email,
            role = user.role.name,
            firstName = user.firstName,
            lastName = user.lastName,
            emailVerified = user.emailVerified
        )
        return Pair(response, refreshToken)
    }

    fun verifyEmail(token: String) {
        val verificationToken =
            verificationTokenRepository.findByToken(token) ?: throw BadRequestException("Invalid verification token")
        if (verificationToken.used)
            throw BadRequestException("Token already used")
        if (verificationToken.expiresAt.isBefore(Instant.now()))
            throw BadRequestException("Token expired")
        verificationToken.user.emailVerified = true
        verificationToken.used = true
    }

    fun forgotPassword(email: String) {
        val user = userRepository.findByEmail(email) ?: return
        passwordResetTokenRepository.deleteAllByUserId(user.id!!)

        val token = PasswordResetToken(user = user)
        passwordResetTokenRepository.save(token)
        emailService.sendPasswordResetEmail(user.email, token.token)
    }

    fun resetPassword(token: String, newPassword: String) {
        val resetToken =
            passwordResetTokenRepository.findByToken(token) ?: throw BadRequestException("Invalid reset token")
        if (resetToken.used)
            throw BadRequestException("Token already used")
        if (resetToken.expiresAt.isBefore(Instant.now()))
            throw BadRequestException("Token expired")
        resetToken.user.updatePassword(passwordEncoder.encode(newPassword)!!)
        resetToken.used = true
    }

    fun resendVerification(email: String) {
        val user = userRepository.findByEmail(email)
            ?: throw NotFoundException("User not found")

        if (user.emailVerified)
            throw ConflictException("Email already verified")

        verificationTokenRepository.deleteAllByUserId(user.id!!)

        val token = VerificationToken(user = user)
        verificationTokenRepository.save(token)
        emailService.sendVerificationEmail(user.email, token.token)
    }

    fun refresh(refreshToken: String): String {
        if (jwtService.isTokenExpired(refreshToken))
            throw ForbiddenException("Refresh token expired")

        val email = jwtService.extractUsername(refreshToken)
        val user = userRepository.findByEmail(email)
            ?: throw NotFoundException("User not found")

        return jwtService.generateToken(user)
    }

    fun updateProfile(user: User, request: UpdateProfileRequest): UserResponse {
        user.firstName = request.firstName
        user.lastName = request.lastName
        userRepository.save(user)
        return UserResponse(
            email = user.email,
            role = user.role.name,
            firstName = user.firstName,
            lastName = user.lastName,
            emailVerified = user.emailVerified
        )
    }

    fun changePassword(user: User, request: ChangePasswordRequest) {
        if (!passwordEncoder.matches(request.currentPassword, user.password))
            throw ForbiddenException("Current password is incorrect")
        user.updatePassword(passwordEncoder.encode(request.newPassword)!!)
        userRepository.save(user)
    }
}