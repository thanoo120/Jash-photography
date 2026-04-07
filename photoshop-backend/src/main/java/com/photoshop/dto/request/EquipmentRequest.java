package com.photoshop.dto.request;

import com.photoshop.entity.Equipment;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class EquipmentRequest {

    @NotBlank(message = "Equipment name is required")
    @Size(max = 200)
    private String name;

    @NotBlank(message = "Brand is required")
    @Size(max = 100)
    private String brand;

    private String description;

    @NotNull(message = "Daily rental price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal dailyRentalPrice;

    @NotNull(message = "Weekly rental price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal weeklyRentalPrice;

    @NotNull(message = "Total stock is required")
    @Min(value = 0)
    private Integer totalStock;

    @NotNull(message = "Available stock is required")
    @Min(value = 0)
    private Integer availableStock;

    @NotNull(message = "Category is required")
    private Equipment.EquipmentCategory category;

    private String thumbnailImage;
    private List<String> galleryImages;

    @Size(max = 500)
    private String specifications;

    private boolean active = true;
}
