package com.photoshop.service.impl;

import com.photoshop.dto.request.ReviewRequest;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.dto.response.ReviewResponse;
import com.photoshop.entity.Equipment;
import com.photoshop.entity.Review;
import com.photoshop.entity.Service;
import com.photoshop.entity.User;
import com.photoshop.exception.BadRequestException;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final EquipmentRepository equipmentRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String userEmail) {
        if (request.getServiceId() == null && request.getEquipmentId() == null) {
            throw new BadRequestException("Review must target either a service or equipment");
        }

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review.ReviewBuilder builder = Review.builder()
            .user(user)
            .rating(request.getRating())
            .comment(request.getComment())
            .approved(false);

        if (request.getServiceId() != null) {
            Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", request.getServiceId()));
            builder.service(service);
        }

        if (request.getEquipmentId() != null) {
            Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", request.getEquipmentId()));
            builder.equipment(equipment);
        }

        return toResponse(reviewRepository.save(builder.build()));
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getServiceReviews(Long serviceId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PagedResponse.from(reviewRepository.findByServiceIdAndApprovedTrue(serviceId, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getEquipmentReviews(Long equipmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PagedResponse.from(reviewRepository.findByEquipmentIdAndApprovedTrue(equipmentId, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getPendingReviews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PagedResponse.from(reviewRepository.findByApprovedFalse(pageable).map(this::toResponse));
    }

    @Transactional
    public ReviewResponse approveReview(Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review", id));
        review.setApproved(true);
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse replyToReview(Long id, String adminReply) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review", id));
        review.setAdminReply(adminReply);
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Review", id));
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
            .id(review.getId())
            .userId(review.getUser().getId())
            .userFullName(review.getUser().getFullName())
            .userProfileImage(review.getUser().getProfileImage())
            .serviceId(review.getService() != null ? review.getService().getId() : null)
            .serviceName(review.getService() != null ? review.getService().getName() : null)
            .equipmentId(review.getEquipment() != null ? review.getEquipment().getId() : null)
            .equipmentName(review.getEquipment() != null ? review.getEquipment().getName() : null)
            .rating(review.getRating())
            .comment(review.getComment())
            .approved(review.isApproved())
            .adminReply(review.getAdminReply())
            .createdAt(review.getCreatedAt())
            .updatedAt(review.getUpdatedAt())
            .build();
    }
}
