package com.eventify.dev.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {
	@Id
	@Builder.Default
    private  UUID id = UUID.randomUUID();
	@ManyToOne
    private User attendee;

    @ManyToOne
    private Event event;

    @ManyToOne
    private Session session;

    private boolean cancelled;

}
