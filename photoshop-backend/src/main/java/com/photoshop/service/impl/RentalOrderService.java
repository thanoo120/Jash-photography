package com.photoshop.service.impl;

import com.photoshop.dto.request.RentalOrderRequest;
import com.photoshop.dto.response.PagedResponse;
import com.photoshop.dto.response.RentalOrderResponse;
import com.photoshop.entity.*;
import com.photoshop.exception.BadRequestException;
import com.photoshop.exception.ResourceNotFoundException;
import com.photoshop.repository.EquipmentRepository;
import com.photoshop.repository.RentalOrderRepository;
import com.photoshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RentalOrderService {

    private final RentalOrderRepository rentalOrderRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public RentalOrderResponse createOrder(RentalOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!request.getRentalEndDate().isAfter(request.getRentalStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        long days = ChronoUnit.DAYS.between(request.getRentalStartDate(), request.getRentalEndDate());

        List<RentalOrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (RentalOrderRequest.RentalOrderItemRequest itemReq : request.getItems()) {
            Equipment equipment = equipmentRepository.findById(itemReq.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", itemReq.getEquipmentId()));

            if (!equipment.isActive()) {
                throw new BadRequestException("Equipment '" + equipment.getName() + "' is not available");
            }
            if (equipment.getAvailableStock() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + equipment.getName()
                    + ". Available: " + equipment.getAvailableStock());
            }

            BigDecimal unitPrice = days >= 7
                ? equipment.getWeeklyRentalPrice().divide(BigDecimal.valueOf(7)).multiply(BigDecimal.valueOf(days))
                : equipment.getDailyRentalPrice().multiply(BigDecimal.valueOf(days));

            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(subtotal);

            // Reduce available stock
            equipment.setAvailableStock(equipment.getAvailableStock() - itemReq.getQuantity());
            equipmentRepository.save(equipment);

            items.add(RentalOrderItem.builder()
                .equipment(equipment)
                .quantity(itemReq.getQuantity())
                .unitPrice(unitPrice)
                .subtotal(subtotal)
                .build());
        }

        String orderNumber = "RO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        RentalOrder order = RentalOrder.builder()
            .orderNumber(orderNumber)
            .user(user)
            .rentalStartDate(request.getRentalStartDate())
            .rentalEndDate(request.getRentalEndDate())
            .deliveryAddress(request.getDeliveryAddress())
            .status(RentalOrder.OrderStatus.PENDING)
            .totalAmount(total)
            .paymentStatus(RentalOrder.PaymentStatus.UNPAID)
            .orderItems(new ArrayList<>())
            .build();

        RentalOrder savedOrder = rentalOrderRepository.save(order);
        items.forEach(item -> item.setRentalOrder(savedOrder));
        savedOrder.setOrderItems(items);
        rentalOrderRepository.save(savedOrder);

        return toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public PagedResponse<RentalOrderResponse> getUserOrders(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PagedResponse.from(rentalOrderRepository.findByUserId(user.getId(), pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public RentalOrderResponse getOrderById(Long id, String userEmail) {
        RentalOrder order = rentalOrderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rental order", id));
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r == User.Role.ROLE_ADMIN);
        if (!isAdmin && !order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
        return toResponse(order);
    }

    @Transactional
    public RentalOrderResponse updateOrderStatus(Long id, RentalOrder.OrderStatus status, String adminNotes) {
        RentalOrder order = rentalOrderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rental order", id));

        // Restore stock when returned or cancelled
        if (status == RentalOrder.OrderStatus.RETURNED || status == RentalOrder.OrderStatus.CANCELLED) {
            for (RentalOrderItem item : order.getOrderItems()) {
                Equipment equipment = item.getEquipment();
                equipment.setAvailableStock(equipment.getAvailableStock() + item.getQuantity());
                equipmentRepository.save(equipment);
            }
        }

        order.setStatus(status);
        if (adminNotes != null) order.setAdminNotes(adminNotes);
        return toResponse(rentalOrderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public PagedResponse<RentalOrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PagedResponse.from(rentalOrderRepository.findAll(pageable).map(this::toResponse));
    }

    private RentalOrderResponse toResponse(RentalOrder order) {
        List<RentalOrderResponse.RentalOrderItemResponse> itemResponses = order.getOrderItems().stream()
            .map(item -> RentalOrderResponse.RentalOrderItemResponse.builder()
                .id(item.getId())
                .equipmentId(item.getEquipment().getId())
                .equipmentName(item.getEquipment().getName())
                .equipmentBrand(item.getEquipment().getBrand())
                .thumbnailImage(item.getEquipment().getThumbnailImage())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build())
            .collect(Collectors.toList());

        return RentalOrderResponse.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .userId(order.getUser().getId())
            .userFullName(order.getUser().getFullName())
            .userEmail(order.getUser().getEmail())
            .rentalStartDate(order.getRentalStartDate())
            .rentalEndDate(order.getRentalEndDate())
            .deliveryAddress(order.getDeliveryAddress())
            .status(order.getStatus())
            .totalAmount(order.getTotalAmount())
            .paymentStatus(order.getPaymentStatus())
            .paymentReference(order.getPaymentReference())
            .adminNotes(order.getAdminNotes())
            .orderItems(itemResponses)
            .createdAt(order.getCreatedAt())
            .updatedAt(order.getUpdatedAt())
            .build();
    }
}
