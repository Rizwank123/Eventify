package com.eventify.dev.dto;


import com.eventify.dev.entity.Role;
import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private Role role;
}
