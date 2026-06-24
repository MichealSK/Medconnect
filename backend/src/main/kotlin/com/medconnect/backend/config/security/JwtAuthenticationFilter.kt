package com.medconnect.backend.config.security

import com.medconnect.backend.user.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val jwt = authHeader.substring(7)

        runCatching { jwtService.extractUsername(jwt) }
            .onSuccess { email ->
                if (SecurityContextHolder.getContext().authentication == null) {
                    val user = userRepository.findByEmail(email)
                    if (user != null && jwtService.isTokenValid(jwt, user)) {
                        UsernamePasswordAuthenticationToken(
                            user, null, user.authorities
                        ).apply {
                            details = WebAuthenticationDetailsSource().buildDetails(request)
                            SecurityContextHolder.getContext().authentication = this
                        }
                    }
                }
            }

        filterChain.doFilter(request, response)
    }
}