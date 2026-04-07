package com.photoshop.dto.response;

import com.photoshop.entity.Equipment;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentResponse {
    private Long id;
    private String name;
    private String brand;
    private String description;
    private BigDecimal dailyRentalPrice;
    private BigDecimal weeklyRentalPrice;
    private Integer totalStock;
    private Integer availableStock;
    private Equipment.EquipmentCategory category;
    private String thumbnailImage;
    private List<String> galleryImages;
    private String specifications;
    private boolean active;
    private Double averageRating;
    private Long reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
