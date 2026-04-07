package com.photoshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gallery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gallery extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GalleryCategory category;

    @Column(nullable = false)
    @Builder.Default
    private boolean featured = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    public enum GalleryCategory {
        PORTRAIT, WEDDING, CORPORATE, PRODUCT, EVENT, FAMILY, FASHION, REAL_ESTATE
    }
}
