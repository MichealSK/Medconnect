package com.medconnect.backend.auth

import com.medconnect.backend.auth.dto.*
import com.medconnect.backend.user.User
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthenticationService) {
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@Valid @RequestBody request: RegisterRequest) = authService.register(request)

    @PostMapping("/register/doctor")
    @ResponseStatus(HttpStatus.CREATED)
    fun registerDoctor(@Valid @RequestBody request: DoctorRegisterRequest) =
        authService.registerDoctor(request)

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        val (response, refreshToken) = authService.login(request)

        val cookie = ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(7 * 24 * 60 * 60L)
            .build()

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(response)
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<String> {
        val cookie = ResponseCookie.from("refresh_token", "")
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(0)
            .build()
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body("Logged out")
    }

    @GetMapping("/verify-email")
    fun verifyEmail(@RequestParam token: String): ResponseEntity<String> {
        authService.verifyEmail(token)
        return ResponseEntity.ok("Email verified successfully")
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun forgotPassword(@RequestParam email: String) = authService.forgotPassword(email)

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    fun resetPassword(@RequestParam token: String, @RequestParam newPassword: String) =
        authService.resetPassword(token, newPassword)

    @PostMapping("/resend-verification")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun resendVerification(@RequestParam email: String) =
        authService.resendVerification(email)

    @PostMapping("/refresh")
    fun refresh(@CookieValue("refresh_token") refreshToken: String?): ResponseEntity<Map<String, String>> {
        if (refreshToken == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val newAccessToken = authService.refresh(refreshToken)
        return ResponseEntity.ok(mapOf("access_token" to newAccessToken))
    }

    @GetMapping("/me")
    fun getCurrentUser(@AuthenticationPrincipal user: User): ResponseEntity<UserResponse> {
        return ResponseEntity.ok(
            UserResponse(
                email = user.email,
                role = user.role.name,
                firstName = user.firstName,
                lastName = user.lastName,
                emailVerified = user.emailVerified
            )
        )
    }

    @PutMapping("/me")
    fun updateProfile(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: UpdateProfileRequest
    ): ResponseEntity<UserResponse> =
        ResponseEntity.ok(authService.updateProfile(user, request))

    @PutMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun changePassword(
        @AuthenticationPrincipal user: User,
        @Valid @RequestBody request: ChangePasswordRequest
    ) = authService.changePassword(user, request)
}