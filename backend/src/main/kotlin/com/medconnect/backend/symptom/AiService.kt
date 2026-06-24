package com.medconnect.backend.symptom

import com.medconnect.backend.config.properties.AppProperties
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class AiService(private val appProperties: AppProperties) {

    private val restClient = RestClient.create()

    fun generateBrief(symptomForm: SymptomForm): String {
        val prompt = buildPrompt(symptomForm)

        val request = GroqRequest(
            model = appProperties.aiModel,
            messages = listOf(
                GroqMessage(
                    role = "system",
                    content = "You are a medical assistant helping a doctor prepare for a telemedicine consultation."
                ),
                GroqMessage(role = "user", content = prompt)
            )
        )

        return runCatching {
            val response = restClient.post()
                .uri(appProperties.aiBaseUrl)
                .header("Authorization", "Bearer ${appProperties.aiApiKey}")
                .header("Content-Type", "application/json")
                .body(request)
                .retrieve()
                .body(GroqResponse::class.java)

            response?.choices?.firstOrNull()?.message?.content
                ?: "AI brief could not be generated"
        }.getOrElse {
            "AI brief could not be generated: ${it.message}"
        }
    }

    private fun buildPrompt(form: SymptomForm): String = """
        Given the patient's symptom form below, produce a concise structured brief with:
        1. Summary of main complaint (2-3 sentences)
        2. Urgency level: Low / Medium / High with one-line justification
        3. Suggested questions for the doctor to ask
        4. Relevant background (medications, known conditions)
        
        Keep the brief under 300 words. Do not make diagnoses.
        
        Patient symptom form:
        - Main symptoms: ${form.symptomsText}
        - Duration: ${form.durationDays?.let { "$it days" } ?: "not specified"}
        - Severity (1-10): ${form.severity ?: "not specified"}
        - Current medications: ${form.medications ?: "none reported"}
        - Known conditions: ${form.knownConditions ?: "none reported"}
    """.trimIndent()
}

data class GroqRequest(
    val model: String,
    val messages: List<GroqMessage>
)

data class GroqMessage(
    val role: String,
    val content: String
)

data class GroqResponse(
    val choices: List<GroqChoice>
)

data class GroqChoice(
    val message: GroqMessage
)