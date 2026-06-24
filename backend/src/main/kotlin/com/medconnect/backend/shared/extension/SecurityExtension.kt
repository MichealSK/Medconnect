package com.medconnect.backend.shared.extension

import com.medconnect.backend.user.User
import org.springframework.security.core.context.SecurityContextHolder

fun currentUser(): User =
    SecurityContextHolder.getContext().authentication?.principal as User
