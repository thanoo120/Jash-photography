package com.photoshop.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalServices;
    private Long totalEquipment;
    private Long totalBookings;
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long totalRentalOrders;
    private Long pendingRentalOrders;
    private Long pendingReviews;
    private BigDecimal totalRevenue;
    private BigDecimal rentalRevenue;
    private List<RecentBookingDto> recentBookings;
    private Map<String, Long> bookingsByStatus;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentBookingDto {
        private Long id;
        private String userFullName;
        private String serviceName;
        private String bookingDate;
        private String status;
        private String totalAmount;
    }
}
