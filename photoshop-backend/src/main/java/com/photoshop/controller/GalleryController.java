package com.photoshop.controller;

import com.photoshop.dto.request.GalleryRequest;
import com.photoshop.dto.response.GalleryResponse;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.entity.Gallery;
import com.photoshop.service.impl.GalleryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gallery")
@RequiredArgsConstructor
@Tag(name = "Gallery", description = "Portfolio/showcase gallery")
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping
    @Operation(summary = "Get all gallery items (paginated)")
    public ResponseEntity<PagedResponse<GalleryResponse>> getAllGallery(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(galleryService.getAllGallery(page, size));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured gallery items")
    public ResponseEntity<List<GalleryResponse>> getFeaturedGallery() {
        return ResponseEntity.ok(galleryService.getFeaturedGallery());
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get gallery by category")
    public ResponseEntity<List<GalleryResponse>> getByCategory(@PathVariable Gallery.GalleryCategory category) {
        return ResponseEntity.ok(galleryService.getGalleryByCategory(category));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Add gallery item (Admin)")
    public ResponseEntity<GalleryResponse> createGalleryItem(@Valid @RequestBody GalleryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(galleryService.createGalleryItem(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update gallery item (Admin)")
    public ResponseEntity<GalleryResponse> updateGalleryItem(
            @PathVariable Long id,
            @Valid @RequestBody GalleryRequest request) {
        return ResponseEntity.ok(galleryService.updateGalleryItem(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete gallery item (Admin)")
    public ResponseEntity<Void> deleteGalleryItem(@PathVariable Long id) {
        galleryService.deleteGalleryItem(id);
        return ResponseEntity.noContent().build();
    }
}
