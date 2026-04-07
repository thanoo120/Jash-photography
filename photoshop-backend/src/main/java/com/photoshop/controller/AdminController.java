package com.photoshop.controller;

import com.photoshop.dto.response.DashboardStatsResponse;
import com.photoshop.entity.User;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.UserRepository;
import com.photoshop.service.impl.AdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin", description = "Admin dashboard and user management")
public class AdminController {

    private final AdminDashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsResponse> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<Page<Map<String, Object>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<User> users = userRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        Page<Map<String, Object>> response = users.map(u -> Map.of(
                "id", u.getId(),
                "fullName", u.getFullName(),
                "email", u.getEmail(),
                "phone", u.getPhone() != null ? u.getPhone() : "",
                "roles", u.getRoles(),
                "enabled", u.isEnabled(),
                "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
        ));
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Enable or disable a user account")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "enabled", user.isEnabled(),
                "message", "User " + (user.isEnabled() ? "enabled" : "disabled") + " successfully"
        ));
    }

    @PatchMapping("/users/{id}/make-admin")
    @Operation(summary = "Grant admin role to a user")
    public ResponseEntity<Map<String, Object>> makeAdmin(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.getRoles().add(User.Role.ROLE_ADMIN);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Admin role granted to " + user.getFullName()));
    }
}
