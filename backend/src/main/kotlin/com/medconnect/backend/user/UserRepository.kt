package com.medconnect.backend.user

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface UserRepository : JpaRepository<User, UUID> {
    fun findByEmail(email: String): User?
    fun existsByEmail(email: String): Boolean
    fun countByRole(role: Role): Long

}