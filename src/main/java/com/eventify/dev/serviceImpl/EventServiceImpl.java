package com.eventify.dev.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.eventify.dev.dto.EventRequest;
import com.eventify.dev.dto.EventResponse;
import com.eventify.dev.entity.Event;
import com.eventify.dev.entity.EventStatus;
import com.eventify.dev.entity.Notification;
import com.eventify.dev.entity.User;
import com.eventify.dev.exception.EventNotFound;
import com.eventify.dev.exception.UserNotFoundException;
import com.eventify.dev.repository.EventRepository;
import com.eventify.dev.repository.NotificationRepository;
import com.eventify.dev.repository.UserRepository;
import com.eventify.dev.security.UserDetailsImpl;
import com.eventify.dev.service.EventService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
	// Constructor injection for EventRepository
	private final EventRepository eventRepository;
	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;
	
	
	@Override
	public EventResponse createEvent(EventRequest eventRquest) {
		UserDetailsImpl currentUser = getCurrentUser();
        User organizer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new UserNotFoundException("Organizer not found"));

        Event event = Event.builder()
                .title(eventRquest.getTitle())
                .description(eventRquest.getDescription())
                .location(eventRquest.getLocation())
                .dateTime(eventRquest.getDateTime())
                .organizer(organizer)
                .status(EventStatus.ACTIVE)
                .build();

        Event saved = eventRepository.save(event);
        // Notify the organizer about the event creation
		Notification notification = Notification.builder()
				.recipient(organizer)
				.title("Event Created")
				.message("Your event " + event.getTitle() + " has been created.")
				.timestamp(LocalDateTime.now())
				.build();	
		notificationRepository.save(notification);
        return mapToResponse(saved);
		
	}

	@Override
	public EventResponse updateEvent(UUID id, EventRequest request) {
		Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFound("Event not found"));
			
		if (request.getTitle() != null) {
			event.setTitle(request.getTitle());
		}	
		if (request.getDescription() != null) {
			event.setDescription(request.getDescription());
		}
		if (request.getLocation() != null) {
			event.setLocation(request.getLocation());
		}
		if (request.getDateTime() != null) {
			event.setDateTime(request.getDateTime());
		}
		Event updatedEvent = eventRepository.save(event);
		// Notify the organizer about the update
		Notification notification = Notification.builder()
				.recipient(event.getOrganizer())
				.title("Event Updated")
				.message("Your event " + event.getTitle() + " has been updated.")
				.timestamp(LocalDateTime.now())
				.build();
		
		notificationRepository.save(notification);
        return mapToResponse(updatedEvent);
	}

	@Override
	public EventResponse getEventById(UUID id) {
		Event event = eventRepository.findById(id).orElseThrow(() -> new EventNotFound("Event not found"));

		return mapToResponse(event);
		
	}

	@Override
	public List<EventResponse> getMyEvents() {
		UUID organizerId = getCurrentUser().getId();
        return eventRepository.findByOrganizerId(organizerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
	}
	
	private UserDetailsImpl getCurrentUser() {
        return (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }
	
	private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .dateTime(event.getDateTime())
                .status(event.getStatus())
                .organizerUsername(event.getOrganizer().getUsername())
                .build();
    }

	@Override
	public List<EventResponse> getAllEvents() {
		return eventRepository.findAll().stream().map(this::mapToResponse).toList();
	}

}
