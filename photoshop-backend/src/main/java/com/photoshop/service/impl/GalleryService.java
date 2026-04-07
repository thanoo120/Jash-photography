package com.photoshop.service.impl;

import com.photoshop.dto.request.GalleryRequest;
import com.photoshop.dto.response.GalleryResponse;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.entity.Gallery;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryRepository galleryRepository;

    @Transactional(readOnly = true)
    public PagedResponse<GalleryResponse> getAllGallery(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return PagedResponse.from(galleryRepository.findByActiveTrue(pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public List<GalleryResponse> getFeaturedGallery() {
        return galleryRepository.findByActiveTrueAndFeaturedTrueOrderBySortOrderAsc()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GalleryResponse> getGalleryByCategory(Gallery.GalleryCategory category) {
        return galleryRepository.findByActiveTrueAndCategory(category)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public GalleryResponse createGalleryItem(GalleryRequest request) {
        int sortOrder = request.getSortOrder() != null ? request.getSortOrder() : 0;
        Gallery gallery = Gallery.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .imageUrl(request.getImageUrl())
            .category(request.getCategory())
            .featured(request.isFeatured())
            .sortOrder(sortOrder)
            .active(request.isActive())
            .build();
        return toResponse(galleryRepository.save(gallery));
    }

    @Transactional
    public GalleryResponse updateGalleryItem(Long id, GalleryRequest request) {
        Gallery gallery = galleryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));
        gallery.setTitle(request.getTitle());
        gallery.setDescription(request.getDescription());
        gallery.setImageUrl(request.getImageUrl());
        gallery.setCategory(request.getCategory());
        gallery.setFeatured(request.isFeatured());
        gallery.setSortOrder(request.getSortOrder());
        gallery.setActive(request.isActive());
        return toResponse(galleryRepository.save(gallery));
    }

    @Transactional
    public void deleteGalleryItem(Long id) {
        Gallery gallery = galleryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));
        galleryRepository.delete(gallery);
    }

    private GalleryResponse toResponse(Gallery gallery) {
        return GalleryResponse.builder()
            .id(gallery.getId())
            .title(gallery.getTitle())
            .description(gallery.getDescription())
            .imageUrl(gallery.getImageUrl())
            .category(gallery.getCategory())
            .featured(gallery.isFeatured())
            .sortOrder(gallery.getSortOrder())
            .active(gallery.isActive())
            .createdAt(gallery.getCreatedAt())
            .updatedAt(gallery.getUpdatedAt())
            .build();
    }
}
