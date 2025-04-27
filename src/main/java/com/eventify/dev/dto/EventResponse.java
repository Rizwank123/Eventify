package com.eventify.dev.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.eventify.dev.entity.EventStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventResponse {
	 private UUID id;
	 private String title;
	 private String description;
	 private String location;
	 private LocalDateTime dateTime;
	 private EventStatus status;
	 private String organizerUsername;
	

}
