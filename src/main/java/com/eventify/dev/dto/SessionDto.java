package com.eventify.dev.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionDto {
	private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private UUID eventId;

}
