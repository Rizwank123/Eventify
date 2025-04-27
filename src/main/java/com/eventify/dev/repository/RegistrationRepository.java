package com.eventify.dev.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventify.dev.entity.Registration;
import com.eventify.dev.entity.User;
@Repository
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {
	List<Registration> findByAttendee(User attendee);
}
