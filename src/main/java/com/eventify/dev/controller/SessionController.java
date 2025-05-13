package com.eventify.dev.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.dev.dto.SessionDto;
import com.eventify.dev.entity.Session;
import com.eventify.dev.service.SessionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/sessions")
@Tag(name = "Session", description = "Session management")
@RequiredArgsConstructor
public class SessionController {
	 private final SessionService sessionService;

	 @PostMapping("/create")
	 @PreAuthorize("hasRole('ORGANIZER')")
	 @Operation(summary = "Create a new session", description = "This endpoint allows an organizer to create a new session.")
	 public ResponseEntity<String> createSession(@RequestBody SessionDto dto) {
		 System.out.println("Creating session: " + dto);
	     sessionService.createSession(dto);
	     return ResponseEntity.ok("Session created successfully");
	 }

	    @GetMapping("/event/{eventId}")
	    @Operation(summary = "Get sessions by event ID", description = "This endpoint retrieves all sessions for a specific event.")
	    public ResponseEntity<List<Session>> getSessionsByEvent(@PathVariable UUID eventId) {
	        return ResponseEntity.ok(sessionService.getSessionsByEvent(eventId));
	    }

}
