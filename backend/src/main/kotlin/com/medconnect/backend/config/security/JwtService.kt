package com.medconnect.backend.config.security

import com.medconnect.backend.config.properties.JwtProperties
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.Date

@Service
class JwtService(private val jwtProperties: JwtProperties) {

    fun generateToken(userDetails: UserDetails): String = buildToken(userDetails, jwtProperties.expiryMs)

    fun generateRefreshToken(userDetails: UserDetails): String = buildToken(userDetails, jwtProperties.refreshExpiryMs)

    fun extractUsername(token: String): String = extractClaim(token, Claims::getSubject)

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean =
        extractUsername(token) == userDetails.username && !isTokenExpired(token)

    fun isTokenExpired(token: String): Boolean = extractClaim(token, Claims::getExpiration).before(Date())

    private fun buildToken(userDetails: UserDetails, expiry: Long): String =
        Jwts.builder().subject(userDetails.username).issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expiry)).signWith(signingKey(), Jwts.SIG.HS256).compact()

    private fun <T> extractClaim(token: String, resolver: (Claims) -> T): T = resolver(parseClaims(token))

    private fun parseClaims(token: String): Claims =
        Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).payload

    private fun signingKey() = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret))
}