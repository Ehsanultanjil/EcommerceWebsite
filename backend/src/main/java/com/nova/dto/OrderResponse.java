package com.nova.dto;

import com.nova.entity.Order;
import com.nova.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record OrderResponse(
        UUID id,
        String orderNumber,
        OrderStatus status,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal shippingFee,
        BigDecimal total,
        String shippingName,
        String shippingPhone,
        String shippingAddress,
        List<OrderItemResponse> items,
        PaymentResponse payment,
        OffsetDateTime createdAt
) {
    public static OrderResponse from(Order order, PaymentResponse payment) {
        List<OrderItemResponse> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream().map(OrderItemResponse::from).collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus(),
                order.getSubtotal(),
                order.getDiscount(),
                order.getShippingFee(),
                order.getTotal(),
                order.getShippingName(),
                order.getShippingPhone(),
                order.getShippingAddress(),
                items,
                payment,
                order.getCreatedAt()
        );
    }
}
