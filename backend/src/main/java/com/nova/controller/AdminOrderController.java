package com.nova.controller;

import com.nova.dto.OrderResponse;
import com.nova.dto.UpdateOrderStatusRequest;
import com.nova.entity.OrderStatus;
import com.nova.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

// Access already restricted to ROLE_ADMIN for all of /api/admin/** in SecurityConfig.
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponse> getAllOrders(@RequestParam(required = false) OrderStatus status) {
        return orderService.getAllOrders(status);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateOrderStatus(id, request.status());
    }
}
