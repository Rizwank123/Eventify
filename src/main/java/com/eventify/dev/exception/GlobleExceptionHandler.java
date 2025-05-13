package com.eventify.dev.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.eventify.dev.dto.ErrorResponse;

@ControllerAdvice
public class GlobleExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
		ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setMessage("Validation failed");
		errorResponse.setErrorCode("VALIDATION_ERROR");
		return ResponseEntity.badRequest().body(errorResponse);
	}
	
	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
		ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setMessage(ex.getMessage());
		errorResponse.setErrorCode("USER_NOT_FOUND");
		return ResponseEntity.status(404).body(errorResponse);
	}
	
	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
		ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setMessage(ex.getMessage());
		errorResponse.setErrorCode("USER_ALREADY_EXISTS");
		return ResponseEntity.status(409).body(errorResponse);
	}
	
	@ExceptionHandler(EventNotFound.class)
	public ResponseEntity<ErrorResponse> handleEventNotFoundException(EventNotFound ex) {
		ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setMessage(ex.getMessage());
		errorResponse.setErrorCode("EVENT_NOT_FOUND");
		return ResponseEntity.status(404).body(errorResponse);
	}
	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
		ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setMessage(ex.getMessage());
		errorResponse.setErrorCode("BAD_CREDENTIALS");
		return ResponseEntity.status(401).body(errorResponse);
	}

}
