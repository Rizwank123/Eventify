package com.eventify.dev.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegistrationRespons {
	private UUID registrationId;
    private String eventTitle;
    private String sessionTitle;
    private boolean cancelled;

}
