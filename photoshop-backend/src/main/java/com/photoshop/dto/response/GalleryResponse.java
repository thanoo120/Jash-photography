package com.photoshop.dto.response;

import com.photoshop.entity.Gallery;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GalleryResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Gallery.GalleryCategory category;
    private boolean featured;
    private Integer sortOrder;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
