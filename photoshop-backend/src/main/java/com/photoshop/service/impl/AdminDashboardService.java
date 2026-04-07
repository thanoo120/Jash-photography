package com.photoshop.service.impl;

import com.photoshop.dto.response.DashboardStatsResponse;
import com.photoshop.entity.Booking;
import com.photoshop.entity.RentalOrder;
import com.photoshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        // Booking stats by status
        Map<String, Long> bookingsByStatus = new HashMap<>();
        for (Booking.BookingStatus status : Booking.BookingStatus.values()) {
            bookingsByStatus.put(status.name(), bookingRepository.countByStatus(status));
        }

        // Recent bookings (last 7 days)
        List<DashboardStatsResponse.RecentBookingDto> recentBookings =
            bookingRepository.findRecentBookings(LocalDateTime.now().minusDays(7))
                .stream()
                .limit(10)
                .map(b -> DashboardStatsResponse.RecentBookingDto.builder()
                    .id(b.getId())
                    .userFullName(b.getUser().getFullName())
                    .serviceName(b.getService().getName())
                    .bookingDate(b.getBookingDate().toString())
                    .status(b.getStatus().name())
                    .totalAmount(b.getTotalAmount().toString())
                    .build())
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
            .totalUsers(userRepository.count())
            .totalServices(serviceRepository.countByActiveTrue())
            .totalEquipment(equipmentRepository.countByActiveTrue())
            .totalBookings(bookingRepository.count())
            .pendingBookings(bookingRepository.countByStatus(Booking.BookingStatus.PENDING))
            .confirmedBookings(bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED))
            .totalRentalOrders(rentalOrderRepository.count())
            .pendingRentalOrders(rentalOrderRepository.countByStatus(RentalOrder.OrderStatus.PENDING))
            .pendingReviews(reviewRepository.countByApprovedFalse())
            .totalRevenue(bookingRepository.getTotalRevenue())
            .rentalRevenue(rentalOrderRepository.getTotalRentalRevenue())
            .recentBookings(recentBookings)
            .bookingsByStatus(bookingsByStatus)
            .build();
    }
}
