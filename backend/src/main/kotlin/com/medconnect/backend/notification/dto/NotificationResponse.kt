package com.medconnect.backend.notification.dto

import com.medconnect.backend.notification.Notification
import java.time.Instant
import java.util.UUID

data class NotificationResponse(
    val id: UUID,
    val type: String,
    val message: String,
    val isRead: Boolean,
    val createdAt: Instant
) {
    companion object {
        fun from(notification: Notification) = NotificationResponse(
            id = notification.id!!,
            type = notification.type,
            message = notification.message,
            isRead = notification.isRead,
            createdAt = notification.createdAt
        )
    }
}

data class UnreadCountResponse(val count: Long)
