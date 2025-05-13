package com.eventify.dev.exception;

public class EventNotFound extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public EventNotFound(String message) {
		super(message);
	}

	public EventNotFound(String message, Throwable cause) {
		super(message, cause);
	}

}
