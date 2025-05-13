package com.eventify.dev.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.eventify.dev.exception.UserNotFoundException;
import com.eventify.dev.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	private final UserRepository userRepository;

    @Override
    public UserDetailsImpl loadUserByUsername(String username) throws UserNotFoundException {
        return userRepository.findByUsername(username)
                .map(UserDetailsImpl::new)
                .orElseThrow(() -> new UserNotFoundException("User not found with this username: " + username));
    }
}
