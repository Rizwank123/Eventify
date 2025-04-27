package com.eventify.dev.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventify.dev.entity.Notification;
import com.eventify.dev.entity.User;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
	List<Notification> findByRecipient(User user);

}
