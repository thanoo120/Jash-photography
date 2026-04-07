package com.photoshop.dto.response;

import com.photoshop.entity.Service;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private Service.ServiceType serviceType;
    private String thumbnailImage;
    private List<String> galleryImages;
    private boolean active;
    private Integer maxParticipants;
    private String includes;
    private Double averageRating;
    private Long reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
