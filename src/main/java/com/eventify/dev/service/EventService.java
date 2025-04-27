package com.eventify.dev.service;

import java.util.List;
import java.util.UUID;

import com.eventify.dev.dto.EventRequest;
import com.eventify.dev.dto.EventResponse;

public interface EventService {
	// Defines the methods that will be implemented in the EventServiceImpl class
	public EventResponse  createEvent(EventRequest eventRquest);
	public EventResponse updateEvent(UUID id, EventRequest eventRequest);
	public EventResponse getEventById(UUID id);
	public List<EventResponse> getMyEvents();

}
