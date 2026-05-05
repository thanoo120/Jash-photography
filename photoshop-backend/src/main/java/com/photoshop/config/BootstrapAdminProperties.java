package com.photoshop.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Opt-in bootstrap: creates or promotes the first admin only when enabled and no admin exists yet.
 * See deploy/README-DEPLOY.md for production usage.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "app.bootstrap-admin")
public class BootstrapAdminProperties {

    private boolean enabled = false;

    /** Admin email (required when {@code enabled} is true). */
    private String email = "";

    /** Plain password; stored as BCrypt at bootstrap (required when {@code enabled} is true). */
    private String password = "";
}
