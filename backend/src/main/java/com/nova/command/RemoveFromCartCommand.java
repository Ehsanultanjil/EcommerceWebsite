package com.nova.command;

import com.nova.dto.CartResponse;
import com.nova.service.CartService;

import java.util.UUID;

public class RemoveFromCartCommand implements Command<CartResponse> {

    private final CartService cartService;
    private final UUID userId;
    private final UUID itemId;

    public RemoveFromCartCommand(CartService cartService, UUID userId, UUID itemId) {
        this.cartService = cartService;
        this.userId = userId;
        this.itemId = itemId;
    }

    @Override
    public CartResponse execute() {
        return cartService.removeItem(userId, itemId);
    }
}
