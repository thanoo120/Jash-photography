package com.photoshop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rental_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate rentalStartDate;

    @Column(nullable = false)
    private LocalDate rentalEndDate;

    @Column(columnDefinition = "TEXT")
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    @Column(length = 100)
    private String paymentReference;

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    @OneToMany(mappedBy = "rentalOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RentalOrderItem> orderItems = new ArrayList<>();

    public enum OrderStatus {
        PENDING, CONFIRMED, DISPATCHED, ACTIVE, RETURNED, COMPLETED, CANCELLED
    }

    public enum PaymentStatus {
        UNPAID, PAID, PARTIALLY_PAID, REFUNDED
    }
}
