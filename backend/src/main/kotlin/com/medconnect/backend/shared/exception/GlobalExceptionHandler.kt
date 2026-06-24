package com.medconnect.backend.shared.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.Instant

data class ApiError(
    val status: Int,
    val error: String,
    val message: String,
    val timestamp: Instant = Instant.now()
)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(ex: NotFoundException) =
        error(HttpStatus.NOT_FOUND, ex.message!!)

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(ex: ConflictException) =
        error(HttpStatus.CONFLICT, ex.message!!)

    @ExceptionHandler(BadRequestException::class)
    fun handleBadRequest(ex: BadRequestException) =
        error(HttpStatus.BAD_REQUEST, ex.message!!)

    @ExceptionHandler(ForbiddenException::class)
    fun handleForbidden(ex: ForbiddenException) =
        error(HttpStatus.FORBIDDEN, ex.message!!)

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorized(ex: UnauthorizedException) =
        error(HttpStatus.UNAUTHORIZED, ex.message!!)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ApiError> {
        val message = ex.bindingResult.fieldErrors
            .joinToString(", ") { "${it.field}: ${it.defaultMessage}" }
        return error(HttpStatus.BAD_REQUEST, message)
    }

    private fun error(status: HttpStatus, message: String) =
        ResponseEntity.status(status).body(
            ApiError(status.value(), status.reasonPhrase, message)
        )
}