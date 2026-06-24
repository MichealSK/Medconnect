package com.medconnect.backend.shared.exception

sealed class DomainException(message: String) : RuntimeException(message)

class NotFoundException(message: String) : DomainException(message)
class ConflictException(message: String) : DomainException(message)
class BadRequestException(message: String) : DomainException(message)
class ForbiddenException(message: String) : DomainException(message)
class UnauthorizedException(message: String) : DomainException(message)