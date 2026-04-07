package com.photoshop.controller;

import com.photoshop.dto.request.BookingRequest;
import com.photoshop.dto.response.BookingResponse;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.entity.Booking;
import com.photoshop.service.impl.BookingService;
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
@RequestMapping("/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Bookings", description = "Service booking management")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request, userDetails.getUsername()));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<PagedResponse<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getUsername(), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getBookingById(id, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userDetails.getUsername()));
    }

    // ---- Admin endpoints ----
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all bookings (Admin)")
    public ResponseEntity<PagedResponse<BookingResponse>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.getAllBookings(page, size));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update booking status (Admin)")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Booking.BookingStatus status,
            @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, adminNotes));
    }

    @PatchMapping("/{id}/payment")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update payment status (Admin)")
    public ResponseEntity<BookingResponse> updatePayment(
            @PathVariable Long id,
            @RequestParam Booking.PaymentStatus paymentStatus,
            @RequestParam(required = false) String paymentReference) {
        return ResponseEntity.ok(bookingService.updatePaymentStatus(id, paymentStatus, paymentReference));
    }
}
