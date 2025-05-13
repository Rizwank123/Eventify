package com.eventify.dev.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.eventify.dev.dto.NotificationResponse;
import com.eventify.dev.entity.Notification;
import com.eventify.dev.entity.User;
import com.eventify.dev.exception.UserNotFoundException;
import com.eventify.dev.repository.NotificationRepository;
import com.eventify.dev.repository.UserRepository;
import com.eventify.dev.security.UserDetailsImpl;
import com.eventify.dev.service.NotificationService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImp implements NotificationService {
	private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

	@Override
	public void sendNotification(UUID userId, String message) {
		User recipient = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .timestamp(LocalDateTime.now())
                .read(false)
                .build();

        notificationRepository.save(notification);

	}

	@Override
	public List<NotificationResponse> getMyNotifications() {
		User current = userRepository.findById(getCurrentUser().getId())
                .orElseThrow();

        return notificationRepository.findByRecipient(current).stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .message(n.getMessage())
                        .timestamp(n.getTimestamp())
                        .read(n.isRead())
                        .build())
                .toList();
        }
	private UserDetailsImpl getCurrentUser() {
        return (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }

	@Override
	public void markAsRead(UUID notificationId) {
		// TODO Auto-generated method stub
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new UserNotFoundException("Notification not found"));

		notification.setRead(true);
		notificationRepository.save(notification);
		
	}

}
