package com.eventify.dev.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.dev.dto.RegistrationRespons;
import com.eventify.dev.dto.SessionRegistrationRequest;
import com.eventify.dev.service.RSVPService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/rsvp")
@RequiredArgsConstructor
@Tag(name = "RSVP", description = "RSVP management")
public class RSVPController {
	private final RSVPService rsvpService;

    @PostMapping("/register")
    @Operation(summary = "Register for an event", description = "This endpoint allows a user to register for an event.")
    public ResponseEntity<RegistrationRespons> register(@RequestBody SessionRegistrationRequest request) {
        return ResponseEntity.ok(rsvpService.register(request));
    }

    @PutMapping("/cancel/{id}")
    @Operation(summary = "Cancel registration", description = "This endpoint allows a user to cancel their registration.")
    public ResponseEntity<Void> cancel(@PathVariable UUID id) {
        rsvpService.cancle(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    @Operation(summary = "Get my registrations", description = "This endpoint retrieves all registrations for the authenticated user.")
    public ResponseEntity<List<RegistrationRespons>> myRegistrations() {
        return ResponseEntity.ok(rsvpService.myRegistrations());
    }

}
