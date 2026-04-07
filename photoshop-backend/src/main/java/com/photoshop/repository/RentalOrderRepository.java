package com.photoshop.repository;

import com.photoshop.entity.RentalOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RentalOrderRepository extends JpaRepository<RentalOrder, Long> {

    Page<RentalOrder> findByUserId(Long userId, Pageable pageable);

    Optional<RentalOrder> findByOrderNumber(String orderNumber);

    Page<RentalOrder> findByStatus(RentalOrder.OrderStatus status, Pageable pageable);

    long countByStatus(RentalOrder.OrderStatus status);

    @Query("SELECT COALESCE(SUM(r.totalAmount), 0) FROM RentalOrder r WHERE r.paymentStatus = 'PAID'")
    java.math.BigDecimal getTotalRentalRevenue();
}
