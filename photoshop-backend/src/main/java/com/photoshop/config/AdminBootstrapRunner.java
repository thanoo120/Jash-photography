package com.photoshop.config;

import com.photoshop.entity.User;
import com.photoshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
@Order(Integer.MAX_VALUE)
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private final BootstrapAdminProperties bootstrapProps;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (!bootstrapProps.isEnabled()) {
            return;
        }

        String email = bootstrapProps.getEmail() != null ? bootstrapProps.getEmail().trim() : "";
        String password = bootstrapProps.getPassword() != null ? bootstrapProps.getPassword() : "";
        if (email.isEmpty() || password.isEmpty()) {
            log.warn("app.bootstrap-admin.enabled is true but email or password is empty; skipping admin bootstrap.");
            return;
        }

        if (userRepository.countUsersWithAdminRole() > 0) {
            log.info("Admin bootstrap skipped: database already has at least one admin user.");
            return;
        }

        userRepository.findByEmail(email).ifPresentOrElse(user -> promoteExistingUser(email, user),
            () -> createAdminUser(email, password));
    }

    private void promoteExistingUser(String email, User user) {
        if (!user.getRoles().contains(User.Role.ROLE_ADMIN)) {
            user.getRoles().add(User.Role.ROLE_ADMIN);
            log.info("Admin bootstrap: granted ROLE_ADMIN to existing user {} (password unchanged).", email);
        }
    }

    private void createAdminUser(String email, String passwordFromConfig) {
        User user = User.builder()
            .fullName("Bootstrap Admin")
            .email(email)
            .password(passwordEncoder.encode(passwordFromConfig))
            .roles(new HashSet<>(Set.of(User.Role.ROLE_USER, User.Role.ROLE_ADMIN)))
            .enabled(true)
            .build();
        userRepository.save(user);
        log.info("Admin bootstrap: created admin user for email {}.", email);
    }
}
