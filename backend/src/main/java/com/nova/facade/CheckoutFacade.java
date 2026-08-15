package com.nova.facade;

import com.nova.builder.OrderBuilder;
import com.nova.dto.CheckoutRequest;
import com.nova.dto.OrderResponse;
import com.nova.dto.PaymentResponse;
import com.nova.entity.*;
import com.nova.factory.PaymentFactory;
import com.nova.factory.PaymentProcessor;
import com.nova.factory.PaymentResult;
import com.nova.observer.OrderEventPublisher;
import com.nova.repository.CartRepository;
import com.nova.repository.OrderRepository;
import com.nova.repository.PaymentRepository;
import com.nova.repository.ProductRepository;
import com.nova.strategy.DiscountStrategy;
import com.nova.strategy.NoDiscountStrategy;
import com.nova.strategy.ShippingStrategy;
import com.nova.strategy.ShippingStrategySelector;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Facade: everything a checkout actually requires — validate the cart, price it
 * (Strategy), build the order (Builder), charge it (Factory Method + Adapter),
 * persist, notify (Observer) — collapsed behind one call so CheckoutController
 * stays a one-liner and never has to know these pieces exist separately.
 */
@Component
@RequiredArgsConstructor
@Transactional
public class CheckoutFacade {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ShippingStrategySelector shippingStrategySelector;
    private final PaymentFactory paymentFactory;
    private final OrderEventPublisher orderEventPublisher;

    public OrderResponse checkout(UUID userId, CheckoutRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        List<CartItem> cartItems = cart.getItems();
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        validateStock(cartItems);

        BigDecimal subtotal = cartItems.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Strategy: no coupon system yet, so discount always resolves to zero for now —
        // swapping in a PercentageDiscountStrategy/FixedDiscountStrategy later needs no
        // change here, just a different strategy selected above this line.
        DiscountStrategy discountStrategy = new NoDiscountStrategy();
        ShippingStrategy shippingStrategy = shippingStrategySelector.select(subtotal);
        BigDecimal discount = discountStrategy.apply(subtotal);
        BigDecimal shippingFee = shippingStrategy.calculate(subtotal);

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem oi = new OrderItem();
            oi.setProduct(cartItem.getProduct());
            oi.setProductName(cartItem.getProduct().getName());
            oi.setUnitPrice(cartItem.getUnitPrice());
            oi.setQuantity(cartItem.getQuantity());
            oi.setSubtotal(cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            return oi;
        }).toList();

        // Builder: five independent inputs (identity, shipping, items, three money
        // amounts) collapsed into one readable call instead of a wide constructor.
        Order order = new OrderBuilder()
                .userId(userId)
                .orderNumber(generateOrderNumber())
                .shippingDetails(request.shippingName(), request.shippingPhone(), request.shippingAddress())
                .items(orderItems)
                .subtotal(subtotal)
                .discount(discount)
                .shippingFee(shippingFee)
                .build();

        orderRepository.save(order);

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        // Factory Method: PaymentFactory hands back whichever PaymentProcessor fits the
        // chosen method — this code never names CardPaymentProcessor/MobilePaymentProcessor
        // directly, so a new payment method later is a factory case, not a checkout change.
        PaymentProcessor processor = paymentFactory.create(request.paymentMethod());
        PaymentResult result = processor.process(order.getTotal());

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(request.paymentMethod());
        payment.setStatus(result.status());
        payment.setAmount(order.getTotal());
        payment.setTransactionReference(result.transactionReference());
        payment.setCreatedAt(order.getCreatedAt());
        paymentRepository.save(payment);

        cartItems.clear();
        cart.setUpdatedAt(order.getCreatedAt());
        cartRepository.save(cart);

        // Observer: new order, so there's no "previous" status.
        orderEventPublisher.publish(order, null);

        return OrderResponse.from(order, PaymentResponse.from(payment));
    }

    private void validateStock(List<CartItem> cartItems) {
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (item.getQuantity() > product.getStock()) {
                throw new IllegalArgumentException(
                        "Only " + product.getStock() + " of \"" + product.getName() + "\" in stock");
            }
        }
    }

    private String generateOrderNumber() {
        return "BZ-" + ThreadLocalRandom.current().nextInt(10_000, 100_000);
    }
}
