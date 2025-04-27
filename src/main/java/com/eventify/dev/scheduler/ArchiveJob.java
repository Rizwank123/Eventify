package com.eventify.dev.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.eventify.dev.entity.Event;
import com.eventify.dev.entity.EventStatus;
import com.eventify.dev.entity.Registration;
import com.eventify.dev.repository.EventRepository;
import com.eventify.dev.repository.RegistrationRepository;
import com.eventify.dev.service.NotificationService;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArchiveJob {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 * * * *") // every hour
    public void archivePastEvents() {
        log.info("Running Archive Job...");
        
        List<Event> pastEvents = eventRepository.findAll().stream()
                .filter(e -> e.getStatus() == EventStatus.ACTIVE && e.getDateTime().isBefore(LocalDateTime.now()))
                .toList();

        for (Event event : pastEvents) {
            event.setStatus(EventStatus.ARCHIVED);
            eventRepository.save(event);
            
            List<Registration> regs = registrationRepository.findAll().stream()
                    .filter(r -> !r.isCancelled() && r.getEvent().getId().equals(event.getId()))
                    .toList();

            for (Registration reg : regs) {
                notificationService.sendNotification(
                        reg.getAttendee().getId(),
                        "Event '" + event.getTitle() + "' has been archived."
                );
            }

            log.info("Archived event ID {} and notified {} users.", event.getId(), regs.size());
        }
    }
}
