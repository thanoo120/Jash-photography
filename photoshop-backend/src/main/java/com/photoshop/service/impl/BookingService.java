package com.photoshop.service.impl;

import com.photoshop.dto.request.BookingRequest;
import com.photoshop.dto.response.BookingResponse;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.entity.Booking;
import com.photoshop.entity.Service;
import com.photoshop.entity.User;
import com.photoshop.exception.BadRequestException;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.BookingRepository;
import com.photoshop.repository.ServiceRepository;
import com.photoshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Service service = serviceRepository.findById(request.getServiceId())
            .orElseThrow(() -> new ResourceNotFoundException("Service", request.getServiceId()));

        if (!service.isActive()) {
            throw new BadRequestException("Service is not available");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            request.getBookingDate(), request.getServiceId()
        );
        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Service is already booked for this date. Please choose another date.");
        }

        LocalTime endTime = request.getStartTime()
            .plusMinutes(service.getDurationMinutes() != null ? service.getDurationMinutes() : 60);

        Booking booking = Booking.builder()
            .user(user)
            .service(service)
            .bookingDate(request.getBookingDate())
            .startTime(request.getStartTime())
            .endTime(endTime)
            .location(request.getLocation())
            .specialRequests(request.getSpecialRequests())
            .status(Booking.BookingStatus.PENDING)
            .totalAmount(service.getPrice())
            .paymentStatus(Booking.PaymentStatus.UNPAID)
            .build();

        return toResponse(bookingRepository.save(booking));
    }

    public PagedResponse<BookingResponse> getUserBookings(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingRepository.findByUserId(user.getId(), pageable);
        return PagedResponse.from(bookings.map(this::toResponse));
    }

    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boolean isAdmin = user.getRoles().stream()
            .anyMatch(r -> r == User.Role.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
        return toResponse(booking);
    }

    public BookingResponse cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r == User.Role.ROLE_ADMIN);
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return toResponse(bookingRepository.save(booking));
    }

    // Admin operations
    public PagedResponse<BookingResponse> getAllBookings(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return PagedResponse.from(bookings.map(this::toResponse));
    }

    public BookingResponse updateBookingStatus(Long id, Booking.BookingStatus status, String adminNotes) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        booking.setStatus(status);
        if (adminNotes != null) booking.setAdminNotes(adminNotes);
        return toResponse(bookingRepository.save(booking));
    }

    public BookingResponse updatePaymentStatus(Long id, Booking.PaymentStatus paymentStatus, String paymentReference) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        booking.setPaymentStatus(paymentStatus);
        if (paymentReference != null) booking.setPaymentReference(paymentReference);
        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
            .id(booking.getId())
            .userId(booking.getUser().getId())
            .userFullName(booking.getUser().getFullName())
            .userEmail(booking.getUser().getEmail())
            .serviceId(booking.getService().getId())
            .serviceName(booking.getService().getName())
            .bookingDate(booking.getBookingDate())
            .startTime(booking.getStartTime())
            .endTime(booking.getEndTime())
            .location(booking.getLocation())
            .specialRequests(booking.getSpecialRequests())
            .status(booking.getStatus())
            .totalAmount(booking.getTotalAmount())
            .paymentStatus(booking.getPaymentStatus())
            .paymentReference(booking.getPaymentReference())
            .adminNotes(booking.getAdminNotes())
            .createdAt(booking.getCreatedAt())
            .updatedAt(booking.getUpdatedAt())
            .build();
    }
}
