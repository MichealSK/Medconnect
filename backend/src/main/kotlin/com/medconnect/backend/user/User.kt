package com.medconnect.backend.user

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "users")
class User(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(name = "password_hash", nullable = false)
    private var passwordHash: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: Role,

    @Column(nullable = false)
    var firstName: String,

    @Column(nullable = false)
    var lastName: String,

    @Column(nullable = false)
    var emailVerified: Boolean = false,

    @Column(nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()

) : UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> =
        listOf(SimpleGrantedAuthority("ROLE_${role.name}"))

    override fun getPassword(): String = passwordHash

    override fun getUsername(): String = email

    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true

    val fullName: String get() = "$firstName $lastName"

    fun updatePassword(newPasswordHash: String) {
        passwordHash = newPasswordHash
    }
}