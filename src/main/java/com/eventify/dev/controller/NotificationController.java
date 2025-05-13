package com.eventify.dev.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.dev.dto.NotificationResponse;
import com.eventify.dev.service.NotificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification", description = "Notification management")	
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get My notifications", description = "This endpoint retrieves all notifications for the authenticated user.")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getMyNotifications());
    }
    @PutMapping("/read/{notificationId}")
    @Operation(summary = "Mark notification as read", description = "This endpoint marks a notification as read.")
	public ResponseEntity<Void> markAsRead(@PathVariable UUID notificationId) {
		notificationService.markAsRead(notificationId);
		return ResponseEntity.ok().build();
	}
}
