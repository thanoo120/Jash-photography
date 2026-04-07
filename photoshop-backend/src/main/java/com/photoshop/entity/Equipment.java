package com.photoshop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRentalPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weeklyRentalPrice;

    @Column(nullable = false)
    private Integer totalStock;

    @Column(nullable = false)
    @Builder.Default
    private Integer availableStock = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentCategory category;

    @Column(length = 255)
    private String thumbnailImage;

    @ElementCollection
    @CollectionTable(name = "equipment_images", joinColumns = @JoinColumn(name = "equipment_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> galleryImages = new ArrayList<>();

    @Column(length = 500)
    private String specifications;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    public enum EquipmentCategory {
        CAMERA, LENS, LIGHTING, TRIPOD, DRONE, BACKDROP, STUDIO_KIT, ACCESSORIES
    }
}
