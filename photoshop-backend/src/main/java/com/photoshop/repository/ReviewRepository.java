package com.photoshop.repository;

import com.photoshop.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByServiceIdAndApprovedTrue(Long serviceId, Pageable pageable);

    Page<Review> findByEquipmentIdAndApprovedTrue(Long equipmentId, Pageable pageable);

    Page<Review> findByApprovedFalse(Pageable pageable);

    List<Review> findByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service.id = :serviceId AND r.approved = true")
    Double getAverageRatingForService(Long serviceId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.equipment.id = :equipmentId AND r.approved = true")
    Double getAverageRatingForEquipment(Long equipmentId);

    long countByApprovedFalse();
}
