package com.eventify.dev.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class SessionRegistrationRequest {
	private UUID sessionId;
	private UUID eventId;

}

