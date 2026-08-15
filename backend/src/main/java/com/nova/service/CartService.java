package com.nova.service;

import com.nova.dto.CartResponse;
import com.nova.entity.Cart;
import com.nova.entity.CartItem;
import com.nova.entity.Product;
import com.nova.exception.ResourceNotFoundException;
import com.nova.repository.CartItemRepository;
import com.nova.repository.CartRepository;
import com.nova.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartResponse getCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        return buildResponse(cart);
    }

    public CartResponse addItem(UUID userId, UUID productId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        int desiredQuantity = (item == null ? 0 : item.getQuantity()) + quantity;
        if (desiredQuantity > product.getStock()) {
            throw new IllegalArgumentException(
                    "Only " + product.getStock() + " of \"" + product.getName() + "\" in stock");
        }

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setUnitPrice(product.getPrice());
        } else {
            item.setQuantity(desiredQuantity);
        }
        cartItemRepository.save(item);
        touch(cart);

        return buildResponse(cart);
    }

    public CartResponse updateItemQuantity(UUID userId, UUID itemId, int quantity) {
        CartItem item = ownedItem(userId, itemId);
        if (quantity > item.getProduct().getStock()) {
            throw new IllegalArgumentException(
                    "Only " + item.getProduct().getStock() + " of \"" + item.getProduct().getName() + "\" in stock");
        }
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        touch(item.getCart());
        return buildResponse(item.getCart());
    }

    public CartResponse removeItem(UUID userId, UUID itemId) {
        CartItem item = ownedItem(userId, itemId);
        Cart cart = item.getCart();
        cartItemRepository.delete(item);
        touch(cart);
        return buildResponse(cart);
    }

    private CartItem ownedItem(UUID userId, UUID itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));
        if (!item.getCart().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Cart item not found: " + itemId);
        }
        return item;
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUserId(userId);
            OffsetDateTime now = OffsetDateTime.now();
            cart.setCreatedAt(now);
            cart.setUpdatedAt(now);
            return cartRepository.save(cart);
        });
    }

    private void touch(Cart cart) {
        cart.setUpdatedAt(OffsetDateTime.now());
        cartRepository.save(cart);
    }

    // Always builds the response from a fresh, explicit item query rather than
    // cart.getItems() — see CartResponse.from() for why that matters.
    private CartResponse buildResponse(Cart cart) {
        return CartResponse.from(cart, cartItemRepository.findByCartId(cart.getId()));
    }
}
