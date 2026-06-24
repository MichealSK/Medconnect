package com.medconnect.backend.appointment


import com.medconnect.backend.appointment.dto.AppointmentRequest
import com.medconnect.backend.appointment.dto.AppointmentResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/appointments")

class AppointmentController(private val appointmentService: AppointmentService) {
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun book(@Valid @RequestBody request: AppointmentRequest) = appointmentService.book(request)

    @GetMapping
    fun getMyAppointments() = appointmentService.getMyAppointments()

    @GetMapping("/{appointmentId}")
    fun getById(@PathVariable appointmentId: UUID) = appointmentService.getById(appointmentId)

    @PutMapping("/{appointmentId}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun cancel(@PathVariable appointmentId: UUID) = appointmentService.cancel(appointmentId)

}