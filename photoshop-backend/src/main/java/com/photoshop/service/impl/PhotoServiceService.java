package com.photoshop.service.impl;

import com.photoshop.dto.request.ServiceRequest;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.dto.response.ServiceResponse;
import com.photoshop.entity.Service;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.ReviewRepository;
import com.photoshop.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class PhotoServiceService {

    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ServiceResponse> getAllServices(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Service> services = serviceRepository.findByActiveTrue(pageable);
        Page<ServiceResponse> responsePage = services.map(this::toResponse);
        return PagedResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        return toResponse(service);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getServicesByType(Service.ServiceType type) {
        return serviceRepository.findByActiveTrueAndServiceType(type)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<ServiceResponse> searchServices(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Service> services = serviceRepository.searchServices(keyword, pageable);
        return PagedResponse.from(services.map(this::toResponse));
    }

    @Transactional
    public ServiceResponse createService(ServiceRequest request) {
        Service service = Service.builder()
            .name(request.getName())
            .description(request.getDescription())
            .price(request.getPrice())
            .durationMinutes(request.getDurationMinutes())
            .serviceType(request.getServiceType())
            .thumbnailImage(request.getThumbnailImage())
                .galleryImages(
                        request.getGalleryImages() != null
                                ? new java.util.ArrayList<>(request.getGalleryImages())
                                : java.util.Collections.emptyList()
                )            .active(request.isActive())
            .maxParticipants(request.getMaxParticipants())
            .includes(request.getIncludes())
            .build();
        return toResponse(serviceRepository.save(service));
    }

    @Transactional
    public ServiceResponse updateService(Long id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service", id));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setServiceType(request.getServiceType());
        service.setThumbnailImage(request.getThumbnailImage());
        if (request.getGalleryImages() != null) service.setGalleryImages(request.getGalleryImages());
        service.setActive(request.isActive());
        service.setMaxParticipants(request.getMaxParticipants());
        service.setIncludes(request.getIncludes());

        return toResponse(serviceRepository.save(service));
    }

    @Transactional
    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        service.setActive(false);
        serviceRepository.save(service);
    }

    private ServiceResponse toResponse(Service service) {
        Double avgRating = reviewRepository.getAverageRatingForService(service.getId());
        long reviewCount = service.getReviews().stream().filter(r -> r.isApproved()).count();
        return ServiceResponse.builder()
            .id(service.getId())
            .name(service.getName())
            .description(service.getDescription())
            .price(service.getPrice())
            .durationMinutes(service.getDurationMinutes())
            .serviceType(service.getServiceType())
            .thumbnailImage(service.getThumbnailImage())
            .galleryImages(service.getGalleryImages())
            .active(service.isActive())
            .maxParticipants(service.getMaxParticipants())
            .includes(service.getIncludes())
            .averageRating(avgRating)
            .reviewCount(reviewCount)
            .createdAt(service.getCreatedAt())
            .updatedAt(service.getUpdatedAt())
            .build();
    }
}
