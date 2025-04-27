package com.eventify.dev.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventify.dev.entity.Event;
@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
	 List<Event> findByOrganizerId(UUID organizerId);

}
