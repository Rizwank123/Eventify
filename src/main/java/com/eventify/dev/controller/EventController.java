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

import com.eventify.dev.dto.EventRequest;
import com.eventify.dev.dto.EventResponse;
import com.eventify.dev.service.EventService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@Tag(name = "Event", description = "Event management")
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {
	private final EventService eventService;

    @PostMapping
    @Operation(summary = "Create a new event", description = "This endpoint allows a user to create a new event.")
    public ResponseEntity<EventResponse> create(@RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.createEvent(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an event", description = "This endpoint allows a user to update an existing event.")
    
    public ResponseEntity<EventResponse> update(@PathVariable UUID id,
                                                @RequestBody EventRequest request) {
    	System.out.println("Event : " + request);
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }
    
    @GetMapping("")
    @Operation(summary = "Get My events", description = "This endpoint retrieves all events.")
    public ResponseEntity<List<EventResponse>> myEvents() {
        return ResponseEntity.ok(eventService.getMyEvents());
    }
    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID", description = "This endpoint retrieves an event by its ID.")
	public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id) {
		return ResponseEntity.ok(eventService.getEventById(id));
	}
    @GetMapping("/all")
    @Operation(summary = "Get all events", description = "This endpoint retrieves all events.")
	public ResponseEntity<List<EventResponse>> getAllEvents() {
		return ResponseEntity.ok(eventService.getAllEvents());
	}

}
