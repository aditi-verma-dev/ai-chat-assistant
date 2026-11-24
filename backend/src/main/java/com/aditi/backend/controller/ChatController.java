package com.aditi.backend.controller;

import com.aditi.backend.dto.ChatRequest;
import com.aditi.backend.dto.ChatResponse;
import com.aditi.backend.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        String reply = geminiService.generateReply(request.messages());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
