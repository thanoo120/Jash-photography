package com.photoshop.repository;

import com.photoshop.entity.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Page<Equipment> findByActiveTrue(Pageable pageable);

    List<Equipment> findByActiveTrueAndCategory(Equipment.EquipmentCategory category);

    Page<Equipment> findByActiveTrueAndAvailableStockGreaterThan(Integer stock, Pageable pageable);

    @Query("SELECT e FROM Equipment e WHERE e.active = true AND " +
           "(LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.brand) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Equipment> searchEquipment(String keyword, Pageable pageable);

    long countByActiveTrue();
}
