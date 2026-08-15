package com.nova.command;

import com.nova.dto.OrderResponse;
import com.nova.service.OrderService;

import java.util.UUID;

public class CancelOrderCommand implements Command<OrderResponse> {

    private final OrderService orderService;
    private final UUID userId;
    private final UUID orderId;

    public CancelOrderCommand(OrderService orderService, UUID userId, UUID orderId) {
        this.orderService = orderService;
        this.userId = userId;
        this.orderId = orderId;
    }

    @Override
    public OrderResponse execute() {
        return orderService.cancelOrder(userId, orderId);
    }
}
