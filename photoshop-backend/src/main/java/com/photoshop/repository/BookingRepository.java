package com.photoshop.repository;

import com.photoshop.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    Page<Booking> findByStatus(Booking.BookingStatus status, Pageable pageable);

    List<Booking> findByBookingDateAndStatus(LocalDate date, Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.bookingDate = :date AND b.service.id = :serviceId " +
           "AND b.status NOT IN ('CANCELLED')")
    List<Booking> findConflictingBookings(LocalDate date, Long serviceId);

    long countByStatus(Booking.BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.paymentStatus = 'PAID'")
    java.math.BigDecimal getTotalRevenue();

    @Query("SELECT b FROM Booking b WHERE b.createdAt >= :startDate ORDER BY b.createdAt DESC")
    List<Booking> findRecentBookings(java.time.LocalDateTime startDate);
}
