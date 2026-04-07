package com.photoshop.controller;

import com.photoshop.service.impl.ImageUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Upload", description = "Image upload to Cloudinary")
public class UploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping("/image")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload an image (Admin)")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "general") String folder) {
        String url = imageUploadService.uploadImage(file, folder);
        return ResponseEntity.ok(Map.of("url", url, "message", "Image uploaded successfully"));
    }

    @PostMapping("/profile-image")
    @Operation(summary = "Upload profile image (authenticated user)")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file) {
        String url = imageUploadService.uploadImage(file, "profiles");
        return ResponseEntity.ok(Map.of("url", url, "message", "Profile image uploaded successfully"));
    }
}
