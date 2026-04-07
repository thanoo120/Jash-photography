package com.photoshop.controller;

import com.photoshop.dto.request.ReviewRequest;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.dto.response.ReviewResponse;
import com.photoshop.service.impl.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Customer reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Submit a review")
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(request, userDetails.getUsername()));
    }

    @GetMapping("/service/{serviceId}")
    @Operation(summary = "Get approved reviews for a service")
    public ResponseEntity<PagedResponse<ReviewResponse>> getServiceReviews(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getServiceReviews(serviceId, page, size));
    }

    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Get approved reviews for equipment")
    public ResponseEntity<PagedResponse<ReviewResponse>> getEquipmentReviews(
            @PathVariable Long equipmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getEquipmentReviews(equipmentId, page, size));
    }

    // ---- Admin endpoints ----
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get pending/unapproved reviews (Admin)")
    public ResponseEntity<PagedResponse<ReviewResponse>> getPendingReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getPendingReviews(page, size));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Approve a review (Admin)")
    public ResponseEntity<ReviewResponse> approveReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.approveReview(id));
    }

    @PatchMapping("/{id}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Reply to a review (Admin)")
    public ResponseEntity<ReviewResponse> replyToReview(
            @PathVariable Long id,
            @RequestParam String adminReply) {
        return ResponseEntity.ok(reviewService.replyToReview(id, adminReply));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete a review (Admin)")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
