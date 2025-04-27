package com.eventify.dev.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
	@Id
	@Builder.Default
    private  UUID id = UUID.randomUUID();
	private String title;
	private String message;
    private LocalDateTime timestamp;

    private boolean read;

    @ManyToOne
    private User recipient;

}
