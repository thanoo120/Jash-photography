package com.photoshop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthRequest {

    @Data
    public static class Register {
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100, message = "Full name must be between 2-100 characters")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 40, message = "Password must be 6-40 characters")
        private String password;

        @Size(max = 20)
        private String phone;
    }

    @Data
    public static class Login {
        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class RefreshToken {
        @NotBlank
        private String refreshToken;
    }
}
