package com.eventify.dev.serviceImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.eventify.dev.dto.SessionDto;
import com.eventify.dev.dto.SessionRegistrationRequest;
import com.eventify.dev.entity.Event;
import com.eventify.dev.entity.Notification;
import com.eventify.dev.entity.Session;
import com.eventify.dev.repository.EventRepository;
import com.eventify.dev.repository.NotificationRepository;
import com.eventify.dev.repository.SessionRepository;
import com.eventify.dev.service.SessionService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class SessionSeviceImp implements SessionService {
	 private final SessionRepository sessionRepository;
	 private final EventRepository eventRepository;
	 private final NotificationRepository notificationRepository;
	@Override
	public void createSession(SessionDto request) {
		 Event event = eventRepository.findById(request.getEventId())
	                .orElseThrow(() -> new RuntimeException("Event not found"));

	        Session session = Session.builder()
	                .title(request.getTitle())
	                .description(request.getDescription())
	                .startTime(request.getStartTime())
	                .endTime(request.getEndTime())
	                .event(event)
	                .build();

	        sessionRepository.save(session);
	        // Notify the event organizer about the session creation
			Notification notification = Notification.builder().recipient(event.getOrganizer()).title("Session Created")
					.message("A new session " + session.getTitle() + " has been created for your event.")
					.timestamp(session.getStartTime()).build();
			notificationRepository.save(notification);
	        

	}

	@Override
	public List<Session> getSessionsByEvent(UUID eventId) {
		return sessionRepository.findByEventId(eventId);
			}

}
