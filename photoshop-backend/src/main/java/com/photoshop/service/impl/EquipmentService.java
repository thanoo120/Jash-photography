package com.photoshop.service.impl;

import com.photoshop.dto.request.EquipmentRequest;
import com.photoshop.dto.response.EquipmentResponse;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.entity.Equipment;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.EquipmentRepository;
import com.photoshop.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public PagedResponse<EquipmentResponse> getAllEquipment(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Equipment> equipment = equipmentRepository.findByActiveTrue(pageable);
        return PagedResponse.from(equipment.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Equipment", id));
        return toResponse(equipment);
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getEquipmentByCategory(Equipment.EquipmentCategory category) {
        return equipmentRepository.findByActiveTrueAndCategory(category)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<EquipmentResponse> getAvailableEquipment(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Equipment> equipment = equipmentRepository.findByActiveTrueAndAvailableStockGreaterThan(0, pageable);
        return PagedResponse.from(equipment.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public PagedResponse<EquipmentResponse> searchEquipment(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Equipment> equipment = equipmentRepository.searchEquipment(keyword, pageable);
        return PagedResponse.from(equipment.map(this::toResponse));
    }

    @Transactional
    public EquipmentResponse createEquipment(EquipmentRequest request) {
        Equipment equipment = Equipment.builder()
            .name(request.getName())
            .brand(request.getBrand())
            .description(request.getDescription())
            .dailyRentalPrice(request.getDailyRentalPrice())
            .weeklyRentalPrice(request.getWeeklyRentalPrice())
            .totalStock(request.getTotalStock())
            .availableStock(request.getAvailableStock())
            .category(request.getCategory())
            .thumbnailImage(request.getThumbnailImage())
            .galleryImages(request.getGalleryImages() != null ? request.getGalleryImages() : List.of())
            .specifications(request.getSpecifications())
            .active(request.isActive())
            .build();
        return toResponse(equipmentRepository.save(equipment));
    }

    @Transactional
    public EquipmentResponse updateEquipment(Long id, EquipmentRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Equipment", id));

        equipment.setName(request.getName());
        equipment.setBrand(request.getBrand());
        equipment.setDescription(request.getDescription());
        equipment.setDailyRentalPrice(request.getDailyRentalPrice());
        equipment.setWeeklyRentalPrice(request.getWeeklyRentalPrice());
        equipment.setTotalStock(request.getTotalStock());
        equipment.setAvailableStock(request.getAvailableStock());
        equipment.setCategory(request.getCategory());
        equipment.setThumbnailImage(request.getThumbnailImage());
        if (request.getGalleryImages() != null) equipment.setGalleryImages(request.getGalleryImages());
        equipment.setSpecifications(request.getSpecifications());
        equipment.setActive(request.isActive());

        return toResponse(equipmentRepository.save(equipment));
    }

    @Transactional
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Equipment", id));
        equipment.setActive(false);
        equipmentRepository.save(equipment);
    }

    private EquipmentResponse toResponse(Equipment equipment) {
        Double avgRating = reviewRepository.getAverageRatingForEquipment(equipment.getId());
        long reviewCount = equipment.getReviews().stream().filter(r -> r.isApproved()).count();
        List<String> galleryImages = equipment.getGalleryImages() == null
            ? List.of()
            : new ArrayList<>(equipment.getGalleryImages());
        return EquipmentResponse.builder()
            .id(equipment.getId())
            .name(equipment.getName())
            .brand(equipment.getBrand())
            .description(equipment.getDescription())
            .dailyRentalPrice(equipment.getDailyRentalPrice())
            .weeklyRentalPrice(equipment.getWeeklyRentalPrice())
            .totalStock(equipment.getTotalStock())
            .availableStock(equipment.getAvailableStock())
            .category(equipment.getCategory())
            .thumbnailImage(equipment.getThumbnailImage())
            .galleryImages(galleryImages)
            .specifications(equipment.getSpecifications())
            .active(equipment.isActive())
            .averageRating(avgRating)
            .reviewCount(reviewCount)
            .createdAt(equipment.getCreatedAt())
            .updatedAt(equipment.getUpdatedAt())
            .build();
    }
}
