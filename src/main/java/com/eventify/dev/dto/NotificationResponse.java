package com.eventify.dev.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponse {
	private UUID id;
    private String message;
    private LocalDateTime timestamp;
    private boolean read;

}
