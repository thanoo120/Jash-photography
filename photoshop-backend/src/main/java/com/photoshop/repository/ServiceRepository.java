package com.photoshop.repository;

import com.photoshop.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    @Query("SELECT s FROM Service s LEFT JOIN FETCH s.galleryImages WHERE s.active = true")
    Page<Service> findByActiveTrue(Pageable pageable);

    List<Service> findByActiveTrueAndServiceType(Service.ServiceType serviceType);

    @Query("SELECT s FROM Service s WHERE s.active = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Service> searchServices(String keyword, Pageable pageable);

    long countByActiveTrue();
}
