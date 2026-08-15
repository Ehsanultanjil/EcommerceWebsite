package com.nova.controller;

import com.nova.command.CommandInvoker;
import com.nova.command.PlaceOrderCommand;
import com.nova.config.CurrentUser;
import com.nova.dto.CheckoutRequest;
import com.nova.dto.OrderResponse;
import com.nova.facade.CheckoutFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutFacade checkoutFacade;
    private final CommandInvoker commandInvoker;

    @PostMapping
    public OrderResponse checkout(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CheckoutRequest request) {
        UUID userId = CurrentUser.id(jwt);
        return commandInvoker.run(
                "PlaceOrder(user=" + userId + ")",
                new PlaceOrderCommand(checkoutFacade, userId, request)
        );
    }
}
