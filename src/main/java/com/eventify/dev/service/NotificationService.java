package com.eventify.dev.service;

import java.util.List;
import java.util.UUID;

import com.eventify.dev.dto.NotificationResponse;

public interface NotificationService {
	public void sendNotification(UUID userId, String message);
	public List<NotificationResponse> getMyNotifications();
	public void markAsRead(UUID notificationId);

}
