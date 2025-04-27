package com.eventify.dev.service;

import java.util.List;
import java.util.UUID;

import com.eventify.dev.dto.SessionDto;
import com.eventify.dev.entity.Session;

public interface SessionService {
	public void createSession(SessionDto request);
	public List<Session> getSessionsByEvent(UUID eventId);

}
