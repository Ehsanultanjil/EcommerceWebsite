package com.nova.service;

import com.nova.dto.OrderResponse;
import com.nova.dto.PaymentResponse;
import com.nova.entity.Order;
import com.nova.entity.OrderItem;
import com.nova.entity.OrderStatus;
import com.nova.entity.Product;
import com.nova.exception.ResourceNotFoundException;
import com.nova.observer.OrderEventPublisher;
import com.nova.repository.OrderRepository;
import com.nova.repository.PaymentRepository;
import com.nova.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Checkout itself lives in CheckoutFacade (Facade/Builder/Factory/Strategy/Observer
 * all meet there) — this service is everything about an order AFTER it's placed:
 * listing, lookup, cancellation, admin status changes.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final OrderEventPublisher orderEventPublisher;

    public List<OrderResponse> getOrdersForUser(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(order -> OrderResponse.from(order, findPayment(order)))
                .toList();
    }

    public OrderResponse getOrderForUser(UUID userId, UUID orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        return OrderResponse.from(order, findPayment(order));
    }

    public OrderResponse cancelOrder(UUID userId, UUID orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("Order can no longer be cancelled (status: " + order.getStatus() + ")");
        }

        OrderStatus previousStatus = order.getStatus();

        // Restock — the order never shipped, so the reserved inventory goes back.
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(OffsetDateTime.now());
        orderRepository.save(order);
        orderEventPublisher.publish(order, previousStatus);

        return OrderResponse.from(order, findPayment(order));
    }

    // ---- Admin ----

    public List<OrderResponse> getAllOrders(OrderStatus statusFilter) {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .filter(o -> statusFilter == null || o.getStatus() == statusFilter)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(order -> OrderResponse.from(order, findPayment(order)))
                .toList();
    }

    public OrderResponse updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        OrderStatus previousStatus = order.getStatus();
        order.setStatus(status);
        order.setUpdatedAt(OffsetDateTime.now());
        orderRepository.save(order);
        orderEventPublisher.publish(order, previousStatus);
        return OrderResponse.from(order, findPayment(order));
    }

    private PaymentResponse findPayment(Order order) {
        return paymentRepository.findByOrderId(order.getId())
                .map(PaymentResponse::from)
                .orElse(null);
    }
}
