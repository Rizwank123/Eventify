package com.eventify.dev.dto;

import lombok.Data;

@Data
public class ErrorResponse {
	private String message;
	private String errorCode;

}
