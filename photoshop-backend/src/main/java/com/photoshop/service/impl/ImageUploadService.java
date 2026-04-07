package com.photoshop.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.photoshop.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUploadService {

    private final Cloudinary cloudinary;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_SIZE = 10 * 1024 * 1024; // 10MB

    public String uploadImage(MultipartFile file, String folder) {
        validateFile(file);
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "photoshop/" + folder,
                    "resource_type", "image",
                    "transformation", "f_auto,q_auto"
                )
            );
            String url = (String) uploadResult.get("secure_url");
            log.info("Image uploaded successfully to folder: {}", folder);
            return url;
        } catch (IOException e) {
            log.error("Image upload failed: {}", e.getMessage());
            throw new BadRequestException("Failed to upload image: " + e.getMessage());
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted: {}", publicId);
        } catch (IOException e) {
            log.warn("Failed to delete image {}: {}", publicId, e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new BadRequestException("File size exceeds 10MB limit");
        }
    }
}
