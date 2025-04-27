package com.eventify.dev.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {
	@Id
	@Builder.Default
    private  UUID id = UUID.randomUUID();
	
	private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    @JsonIgnore
    private Event event;
}
