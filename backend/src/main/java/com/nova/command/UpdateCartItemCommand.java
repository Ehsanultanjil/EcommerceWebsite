package com.nova.command;

import com.nova.dto.CartResponse;
import com.nova.service.CartService;

import java.util.UUID;

public class UpdateCartItemCommand implements Command<CartResponse> {

    private final CartService cartService;
    private final UUID userId;
    private final UUID itemId;
    private final int quantity;

    public UpdateCartItemCommand(CartService cartService, UUID userId, UUID itemId, int quantity) {
        this.cartService = cartService;
        this.userId = userId;
        this.itemId = itemId;
        this.quantity = quantity;
    }

    @Override
    public CartResponse execute() {
        return cartService.updateItemQuantity(userId, itemId, quantity);
    }
}
