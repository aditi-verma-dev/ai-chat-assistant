package com.aditi.backend.service;

import com.aditi.backend.dto.ChatMessage;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public GeminiService(
            RestClient.Builder restClientBuilder,
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.api.model:gemini-3.8-flash}") String model
    ) {
        this.restClient = restClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public String generateReply(List<ChatMessage> messages) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API key is missing. Set GEMINI_API_KEY."
            );
        }

        List<Map<String, Object>> contents = messages.stream()
                .map(message -> {
                    String role = message.role();

                    if (!"user".equals(role) && !"model".equals(role)) {
    throw new IllegalArgumentException(
            "Message role must be 'user' or 'model'."
    );
}
                    return Map.<String, Object>of(
                            "role", role,
                            "parts", List.of(
                                    Map.of("text", message.content())
                            )
                    );
                })
                .toList();

        Map<String, Object> requestBody =
                Map.of("contents", contents);

        try {
            JsonNode response = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null) {
                throw new IllegalStateException(
                        "Gemini returned an empty response."
                );
            }

            JsonNode textNode = response.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode()
                    || textNode.isNull()
                    || textNode.asText().isBlank()) {

                throw new IllegalStateException(
                        "Gemini did not return text. Response: " + response
                );
            }

            return textNode.asText();

        } catch (RestClientResponseException exception) {

            throw new IllegalStateException(
                    "Gemini API error (HTTP "
                            + exception.getStatusCode().value()
                            + "): "
                            + exception.getResponseBodyAsString()
            );
        }
    }
}
