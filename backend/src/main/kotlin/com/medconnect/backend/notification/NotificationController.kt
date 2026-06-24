package com.medconnect.backend.notification

import com.medconnect.backend.notification.dto.UnreadCountResponse
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/notifications")
class NotificationController(
    private val notificationService: NotificationService
) {
    @GetMapping
    fun getMyNotifications() =
        notificationService.getMyNotifications()

    @GetMapping("/unread-count")
    fun getUnreadCount() =
        UnreadCountResponse(notificationService.getUnreadCount())

    @PutMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun markAsRead(@PathVariable id: UUID) =
        notificationService.markAsRead(id)

    @PutMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun markAllAsRead() =
        notificationService.markAllAsRead()

}