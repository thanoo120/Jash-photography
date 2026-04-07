package com.photoshop.controller;

import com.photoshop.entity.User;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.util.Map;

@RestController
@RequestMapping("/users/profile")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "User Profile", description = "User profile management")
public class UserProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @Operation(summary = "Get current user profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(buildProfileResponse(user));
    }

    @PutMapping
    @Operation(summary = "Update current user profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        userRepository.save(user);
        return ResponseEntity.ok(buildProfileResponse(user));
    }

    @PatchMapping("/password")
    @Operation(summary = "Change password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    private Map<String, Object> buildProfileResponse(User user) {
        return Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "address", user.getAddress() != null ? user.getAddress() : "",
                "profileImage", user.getProfileImage() != null ? user.getProfileImage() : "",
                "roles", user.getRoles(),
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
    }

    @Data
    public static class UpdateProfileRequest {
        @Size(min = 2, max = 100)
        private String fullName;
        @Size(max = 20)
        private String phone;
        private String address;
        private String profileImage;
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        @Size(min = 6, max = 40)
        private String newPassword;
    }
}
