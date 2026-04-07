package com.photoshop.repository;

import com.photoshop.entity.Gallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    Page<Gallery> findByActiveTrue(Pageable pageable);

    List<Gallery> findByActiveTrueAndCategory(Gallery.GalleryCategory category);

    List<Gallery> findByActiveTrueAndFeaturedTrueOrderBySortOrderAsc();

    List<Gallery> findByActiveTrueOrderBySortOrderAsc();
}
