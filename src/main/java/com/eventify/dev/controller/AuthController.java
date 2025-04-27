package com.eventify.dev.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.dev.dto.AuthRequest;
import com.eventify.dev.dto.AuthResponse;
import com.eventify.dev.dto.LoginRequest;
import com.eventify.dev.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication management")
public class AuthController {
	private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "This endpoint allows a new user to register.")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) throws Exception {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "This endpoint allows an existing user to login.")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
