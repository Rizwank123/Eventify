package com.eventify.dev.service;



import com.eventify.dev.dto.AuthRequest;
import com.eventify.dev.dto.AuthResponse;
import com.eventify.dev.dto.LoginRequest;
import com.eventify.dev.entity.User;
import com.eventify.dev.exception.UserAlreadyExistsException;
import com.eventify.dev.exception.UserNotFoundException;
import com.eventify.dev.repository.UserRepository;
import com.eventify.dev.security.JwtUtil;
import com.eventify.dev.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(AuthRequest request) throws UserAlreadyExistsException {
		if (userRepository.findByUsername(request.getUsername()).isPresent()) {
			throw new UserAlreadyExistsException("User already exists with this username: "+request.getUsername());
		}
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        userRepository.save(user);

        return new AuthResponse(jwtUtil.generateToken(new UserDetailsImpl(user)));
    }

    public AuthResponse login(LoginRequest request) throws UserNotFoundException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

		User user = userRepository.findByUsername(request.getUsername()).orElseThrow(
				() -> new UserNotFoundException("User not found with this username: " + request.getUsername()));
        return new AuthResponse(jwtUtil.generateToken(new UserDetailsImpl(user)));
    }
}
