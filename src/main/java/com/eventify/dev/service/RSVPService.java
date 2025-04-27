package com.eventify.dev.service;

import java.util.List;
import java.util.UUID;

import com.eventify.dev.dto.RegistrationRespons;
import com.eventify.dev.dto.SessionRegistrationRequest;

public interface RSVPService {
	public RegistrationRespons register(SessionRegistrationRequest request);
	public void cancle(UUID registrationId);
	public List<RegistrationRespons> myRegistrations();

}
