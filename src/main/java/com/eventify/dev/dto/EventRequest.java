package com.eventify.dev.dto;

import java.time.LocalDateTime;

import lombok.Data;
@Data
public class EventRequest {
	 private String title;
	 private String description;
	 private String location;
	 private LocalDateTime dateTime;
}
