package com.eventify.dev.security;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.eventify.dev.entity.Role;
import com.eventify.dev.entity.User;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
public class UserDetailsImpl implements UserDetails {

	private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_" + user.getRole().name());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public Role getRole() {
        return user.getRole();
    }

    public UUID getId() {
        return user.getId();
    }
}
