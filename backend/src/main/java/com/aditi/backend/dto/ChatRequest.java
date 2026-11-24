package com.aditi.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ChatRequest(
        @NotEmpty
        @Size(max = 60, message = "A conversation can contain at most 60 messages.")
        List<@Valid ChatMessage> messages
) {
}
