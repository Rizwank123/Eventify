package com.eventify.dev.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventify.dev.entity.Session;
@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {
	 List<Session> findByEventId(UUID eventId);
}
