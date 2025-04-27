package com.eventify.dev.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
	@Id
	@Builder.Default
    private  UUID id = UUID.randomUUID();

    private String title;
    private String description;
    private String location;

    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @ManyToOne
    private User organizer;

}
