package com.medconnect.backend.config.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val frontendUrl: String,
    val mailFrom: String = "noreply@medconnect.com",
    val mailEnabled: Boolean = false,
    val aiApiKey: String,
    val aiModel: String = "llama-3.3-70b-versatile",
    val aiBaseUrl: String = "https://api.groq.com/openai/v1/chat/completions"
)