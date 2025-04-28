package com.eventify.dev.serviceImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.eventify.dev.dto.RegistrationRespons;
import com.eventify.dev.dto.SessionRegistrationRequest;
import com.eventify.dev.entity.Event;
import com.eventify.dev.entity.Notification;
import com.eventify.dev.entity.Registration;
import com.eventify.dev.entity.Session;
import com.eventify.dev.entity.User;
import com.eventify.dev.repository.EventRepository;
import com.eventify.dev.repository.NotificationRepository;
import com.eventify.dev.repository.RegistrationRepository;
import com.eventify.dev.repository.SessionRepository;
import com.eventify.dev.repository.UserRepository;
import com.eventify.dev.security.UserDetailsImpl;
import com.eventify.dev.service.RSVPService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RSVPServiceImpl implements RSVPService {
	private final EventRepository eventRepository;
    private final SessionRepository sessionRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
	@Override
	public RegistrationRespons register(SessionRegistrationRequest request) {
		 UserDetailsImpl userDetails = getCurrentUser();
	        User attendee = userRepository.findById(userDetails.getId()).orElseThrow();

	        Event event = eventRepository.findById(request.getEventId())
	                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

	        Session session = null;
	        if (request.getSessionId() != null) {
	            session = sessionRepository.findById(request.getSessionId())
	                    .orElseThrow(() -> new EntityNotFoundException("Session not found"));
	        }

	        Registration registration = Registration.builder()
	                .attendee(attendee)
	                .event(event)
	                .session(session)
	                .cancelled(false)
	                .build();

	        Registration saved = registrationRepository.save(registration);
			Notification notification = Notification.builder().recipient(attendee).title("Registration Successful")
					.message("You have successfully registered for " + event.getTitle()
							+ (session != null ? " - " + session.getTitle() : "") + ".")
					.timestamp(event.getDateTime())
					.build();
			notificationRepository.save(notification);
	     
	        return RegistrationRespons.builder()
	                .registrationId(saved.getId())
	                .eventTitle(event.getTitle())
	                .sessionTitle(session != null ? session.getTitle() : null)
	                .cancelled(false)
	                .build();
		
	}

	@Override
	public void cancle(UUID registrationId) {
		 Registration reg = registrationRepository.findById(registrationId)
	                .orElseThrow(() -> new EntityNotFoundException("Registration not found"));
	        reg.setCancelled(true);
	        registrationRepository.save(reg);
			notificationRepository.save(Notification.
					builder()
					.recipient(reg.getAttendee())
					.title("Registration Cancelled")
					.message("Your registration for " + reg.getEvent().getTitle() + " has been cancelled.")
					.build());
	}

	@Override
	public List<RegistrationRespons> myRegistrations() {
		 User attendee = userRepository.findById(getCurrentUser().getId()).orElseThrow();
			return registrationRepository.findByAttendee(attendee).stream()
					.map(reg -> RegistrationRespons.builder().registrationId(reg.getId())
							.eventTitle(reg.getEvent().getTitle())
							.sessionTitle(reg.getSession() != null ? reg.getSession().getTitle() : null)
							.cancelled(reg.isCancelled()).build())
					.toList();
	                
			}
	
	
	private UserDetailsImpl getCurrentUser() {
        return (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

}
