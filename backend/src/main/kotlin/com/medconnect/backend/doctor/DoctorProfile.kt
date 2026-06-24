package com.medconnect.backend.doctor

import com.medconnect.backend.user.User
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Entity
@Table(name = "doctor_profiles")
class DoctorProfile(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,

    @Column(nullable = false)
    var specialty: String,

    @Column(columnDefinition = "TEXT")
    var bio: String? = null,

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "TEXT[]")
    var languages: Array<String> = emptyArray(),

    @Column(nullable = false)
    var timezone: String = "UTC",

    var yearsExperience: Int? = null,

    var profilePhotoUrl: String? = null,
    @Column(nullable = false)
    var averageRating: Double = 0.0,

    @Column(nullable = false)
    var reviewCount: Int = 0

)