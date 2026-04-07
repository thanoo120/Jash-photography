package com.photoshop.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class RentalOrderRequest {

    @NotNull(message = "Rental start date is required")
    @Future(message = "Rental start date must be in the future")
    private LocalDate rentalStartDate;

    @NotNull(message = "Rental end date is required")
    private LocalDate rentalEndDate;

    private String deliveryAddress;

    @NotEmpty(message = "Order must have at least one item")
    private List<RentalOrderItemRequest> items;

    @Data
    public static class RentalOrderItemRequest {
        @NotNull(message = "Equipment ID is required")
        private Long equipmentId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
