package com.photoshop.controller;

import com.photoshop.dto.request.ServiceRequest;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.dto.response.ServiceResponse;
import com.photoshop.entity.Service;
import com.photoshop.service.impl.PhotoServiceService;
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
@RequestMapping("/services")
@RequiredArgsConstructor
@Tag(name = "Services", description = "Photo shooting services")
public class ServiceController {

    private final PhotoServiceService photoServiceService;

    @GetMapping
    @Operation(summary = "Get all active services (paginated)")
    public ResponseEntity<PagedResponse<ServiceResponse>> getAllServices(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(photoServiceService.getAllServices(page, size, sortBy));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(photoServiceService.getServiceById(id));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get services by type")
    public ResponseEntity<List<ServiceResponse>> getServicesByType(@PathVariable Service.ServiceType type) {
        return ResponseEntity.ok(photoServiceService.getServicesByType(type));
    }

    @GetMapping("/search")
    @Operation(summary = "Search services by keyword")
    public ResponseEntity<PagedResponse<ServiceResponse>> searchServices(
        @RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(photoServiceService.searchServices(keyword, page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Create a new service (Admin)")
    public ResponseEntity<ServiceResponse> createService(@Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(photoServiceService.createService(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update a service (Admin)")
    public ResponseEntity<ServiceResponse> updateService(@PathVariable Long id,
                                                          @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(photoServiceService.updateService(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Soft-delete a service (Admin)")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        photoServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
