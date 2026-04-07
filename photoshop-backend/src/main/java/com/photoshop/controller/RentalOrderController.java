package com.photoshop.controller;

import com.photoshop.dto.request.RentalOrderRequest;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.dto.response.RentalOrderResponse;
import com.photoshop.entity.RentalOrder;
import com.photoshop.service.impl.RentalOrderService;
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
@RequestMapping("/rental-orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Rental Orders", description = "Equipment rental order management")
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;

    @PostMapping
    @Operation(summary = "Create a rental order")
    public ResponseEntity<RentalOrderResponse> createOrder(
            @Valid @RequestBody RentalOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rentalOrderService.createOrder(request, userDetails.getUsername()));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's rental orders")
    public ResponseEntity<PagedResponse<RentalOrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(rentalOrderService.getUserOrders(userDetails.getUsername(), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get rental order by ID")
    public ResponseEntity<RentalOrderResponse> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rentalOrderService.getOrderById(id, userDetails.getUsername()));
    }

    // ---- Admin endpoints ----
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all rental orders (Admin)")
    public ResponseEntity<PagedResponse<RentalOrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(rentalOrderService.getAllOrders(page, size));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update rental order status (Admin)")
    public ResponseEntity<RentalOrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam RentalOrder.OrderStatus status,
            @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(rentalOrderService.updateOrderStatus(id, status, adminNotes));
    }
}
