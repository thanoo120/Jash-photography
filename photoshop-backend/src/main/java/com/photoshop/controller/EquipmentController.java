package com.photoshop.controller;

import com.photoshop.dto.request.EquipmentRequest;
import com.photoshop.dto.response.EquipmentResponse;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.entity.Equipment;
import com.photoshop.service.impl.EquipmentService;
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
@RequestMapping("/equipment")
@RequiredArgsConstructor
@Tag(name = "Equipment", description = "Equipment rental listings")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<PagedResponse<EquipmentResponse>> getAllEquipment(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(equipmentService.getAllEquipment(page, size, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponse> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<EquipmentResponse>> getByCategory(@PathVariable Equipment.EquipmentCategory category) {
        return ResponseEntity.ok(equipmentService.getEquipmentByCategory(category));
    }

    @GetMapping("/available")
    public ResponseEntity<PagedResponse<EquipmentResponse>> getAvailableEquipment(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(equipmentService.getAvailableEquipment(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<EquipmentResponse>> searchEquipment(
        @RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(equipmentService.searchEquipment(keyword, page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Add equipment (Admin)")
    public ResponseEntity<EquipmentResponse> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipmentService.createEquipment(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<EquipmentResponse> updateEquipment(@PathVariable Long id,
                                                              @Valid @RequestBody EquipmentRequest request) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
