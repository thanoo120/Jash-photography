package com.photoshop.dto.response;

import com.photoshop.entity.Booking;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private Long serviceId;
    private String serviceName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private String specialRequests;
    private Booking.BookingStatus status;
    private BigDecimal totalAmount;
    private Booking.PaymentStatus paymentStatus;
    private String paymentReference;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
