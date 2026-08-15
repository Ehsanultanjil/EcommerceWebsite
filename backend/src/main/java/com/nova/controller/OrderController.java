package com.nova.controller;

import com.nova.command.CancelOrderCommand;
import com.nova.command.CommandInvoker;
import com.nova.config.CurrentUser;
import com.nova.dto.OrderResponse;
import com.nova.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CommandInvoker commandInvoker;

    @GetMapping
    public List<OrderResponse> getMyOrders(@AuthenticationPrincipal Jwt jwt) {
        return orderService.getOrdersForUser(CurrentUser.id(jwt));
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        return orderService.getOrderForUser(CurrentUser.id(jwt), id);
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancelOrder(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        UUID userId = CurrentUser.id(jwt);
        return commandInvoker.run(
                "CancelOrder(user=" + userId + ", order=" + id + ")",
                new CancelOrderCommand(orderService, userId, id)
        );
    }
}
