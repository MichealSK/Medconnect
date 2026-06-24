package com.medconnect.backend.notification

import com.medconnect.backend.notification.dto.NotificationResponse
import com.medconnect.backend.shared.exception.ForbiddenException
import com.medconnect.backend.shared.exception.NotFoundException
import com.medconnect.backend.shared.extension.currentUser
import com.medconnect.backend.user.User
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val messagingTemplate: SimpMessagingTemplate
) {
    fun createNotification(user: User, type: String, message: String) {
        val notification = Notification(
            user = user,
            type = type,
            message = message
        )
        val saved = notificationRepository.save(notification)

        messagingTemplate.convertAndSendToUser(
            user.id.toString(),
            "queue/notifications",
            NotificationResponse.from(saved)
        )
    }

    fun getMyNotifications(): List<NotificationResponse> {
        val user = currentUser()
        return notificationRepository
            .findByUserIdOrderByCreatedAtDesc(user.id!!)
            .map { NotificationResponse.from(it) }
    }

    fun markAsRead(id: UUID) {
        val user = currentUser()
        val notification = notificationRepository.findById(id)
            .orElseThrow { throw NotFoundException("Notification not found!") }
        if (notification.user.id != user.id)
            throw ForbiddenException("Not your notification!")
        notification.isRead = true
    }

    fun markAllAsRead() {
        val user = currentUser()
        notificationRepository
            .findByUserIdOrderByCreatedAtDesc(user.id!!)
            .filter { !it.isRead }
            .forEach { it.isRead = true }
    }

    fun getUnreadCount(): Long =
        notificationRepository.countByUserIdAndIsReadFalse(currentUser().id!!)
}