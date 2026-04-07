package com.photoshop.dto.response;

import com.photoshop.entity.RentalOrder;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalOrderResponse {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private LocalDate rentalStartDate;
    private LocalDate rentalEndDate;
    private String deliveryAddress;
    private RentalOrder.OrderStatus status;
    private BigDecimal totalAmount;
    private RentalOrder.PaymentStatus paymentStatus;
    private String paymentReference;
    private String adminNotes;
    private List<RentalOrderItemResponse> orderItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RentalOrderItemResponse {
        private Long id;
        private Long equipmentId;
        private String equipmentName;
        private String equipmentBrand;
        private String thumbnailImage;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
