package com.nova.command;

import com.nova.dto.CartResponse;
import com.nova.service.CartService;

import java.util.UUID;

public class AddToCartCommand implements Command<CartResponse> {

    private final CartService cartService;
    private final UUID userId;
    private final UUID productId;
    private final int quantity;

    public AddToCartCommand(CartService cartService, UUID userId, UUID productId, int quantity) {
        this.cartService = cartService;
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
    }

    @Override
    public CartResponse execute() {
        return cartService.addItem(userId, productId, quantity);
    }
}
