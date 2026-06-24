package com.medconnect.backend

import com.medconnect.backend.config.properties.AppProperties
import com.medconnect.backend.config.properties.JwtProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableAsync
@EnableScheduling
@EnableConfigurationProperties(AppProperties::class, JwtProperties::class)
class BackendApplication

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}
