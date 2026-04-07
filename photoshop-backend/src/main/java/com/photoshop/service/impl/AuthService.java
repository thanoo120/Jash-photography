package com.photoshop.service.impl;

import com.photoshop.dto.request.AuthRequest;
import com.photoshop.dto.response.AuthResponse;
import com.photoshop.entity.User;
import com.photoshop.exception.BadRequestException;
import com.photoshop.exception.ConflictException;
import com.photoshop.repository.UserRepository;
import com.photoshop.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
            .fullName(request.getFullName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .roles(Set.of(User.Role.ROLE_USER))
            .enabled(true)
            .build();

        userRepository.save(user);

        String accessToken = jwtUtils.generateTokenFromEmail(user.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse login(AuthRequest.Login request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtUtils.generateToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadRequestException("User not found"));

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }
        String email = jwtUtils.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("User not found"));

        String newAccessToken = jwtUtils.generateTokenFromEmail(email);
        String newRefreshToken = jwtUtils.generateRefreshToken(email);

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        Set<String> roles = user.getRoles().stream()
            .map(Enum::name)
            .collect(Collectors.toSet());

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .user(AuthResponse.UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .roles(roles)
                .build())
            .build();
    }
}
