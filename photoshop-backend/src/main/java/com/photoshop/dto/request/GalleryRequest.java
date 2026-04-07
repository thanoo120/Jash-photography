package com.photoshop.dto.request;

import com.photoshop.entity.Gallery;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GalleryRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Category is required")
    private Gallery.GalleryCategory category;

    private boolean featured = false;
    private Integer sortOrder = 0;
    private boolean active = true;
}
