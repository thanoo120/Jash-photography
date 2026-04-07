package com.photoshop.dto.request;

import com.photoshop.entity.Service;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ServiceRequest {

    @NotBlank(message = "Service name is required")
    @Size(max = 200)
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    private BigDecimal price;

    @Min(value = 30, message = "Duration must be at least 30 minutes")
    private Integer durationMinutes;

    @NotNull(message = "Service type is required")
    private Service.ServiceType serviceType;

    private String thumbnailImage;

    private List<String> galleryImages;

    private boolean active = true;

    private Integer maxParticipants;

    @Size(max = 500)
    private String includes;
}
