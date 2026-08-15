package com.nova.dto;

import com.nova.entity.Cart;
import com.nova.entity.CartItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record CartResponse(
        UUID id,
        List<CartItemResponse> items,
        BigDecimal subtotal
) {
    // Takes the items explicitly (queried fresh by the service) rather than reading
    // cart.getItems() — a Cart that was just constructed+saved in the same call has a
    // null/stale in-memory items field until reloaded via an actual query, which caused
    // POST /api/cart/items to echo an empty cart back on a brand new cart.
    public static CartResponse from(Cart cart, List<CartItem> items) {
        List<CartItemResponse> itemResponses = items.stream()
                .map(CartItemResponse::from)
                .collect(Collectors.toList());

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getId(), itemResponses, subtotal);
    }
}
