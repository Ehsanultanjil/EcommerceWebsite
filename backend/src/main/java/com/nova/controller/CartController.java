package com.nova.controller;

import com.nova.command.AddToCartCommand;
import com.nova.command.CommandInvoker;
import com.nova.command.RemoveFromCartCommand;
import com.nova.command.UpdateCartItemCommand;
import com.nova.config.CurrentUser;
import com.nova.dto.AddCartItemRequest;
import com.nova.dto.CartResponse;
import com.nova.dto.UpdateCartItemRequest;
import com.nova.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CommandInvoker commandInvoker;

    // Plain read — Command pattern is for actions that DO something; a query has
    // nothing to invoke-and-log.
    @GetMapping
    public CartResponse getCart(@AuthenticationPrincipal Jwt jwt) {
        return cartService.getCart(CurrentUser.id(jwt));
    }

    @PostMapping("/items")
    public CartResponse addItem(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AddCartItemRequest request) {
        UUID userId = CurrentUser.id(jwt);
        return commandInvoker.run(
                "AddToCart(user=" + userId + ", product=" + request.productId() + ")",
                new AddToCartCommand(cartService, userId, request.productId(), request.quantity())
        );
    }

    @PutMapping("/items/{id}")
    public CartResponse updateItem(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        UUID userId = CurrentUser.id(jwt);
        return commandInvoker.run(
                "UpdateCartItem(user=" + userId + ", item=" + id + ")",
                new UpdateCartItemCommand(cartService, userId, id, request.quantity())
        );
    }

    @DeleteMapping("/items/{id}")
    public CartResponse removeItem(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        UUID userId = CurrentUser.id(jwt);
        return commandInvoker.run(
                "RemoveFromCart(user=" + userId + ", item=" + id + ")",
                new RemoveFromCartCommand(cartService, userId, id)
        );
    }
}
