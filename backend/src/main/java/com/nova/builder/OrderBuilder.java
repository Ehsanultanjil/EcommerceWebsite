package com.nova.builder;

import com.nova.entity.Order;
import com.nova.entity.OrderItem;
import com.nova.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Builder: Order has enough independent fields (customer, shipping, items, three
 * separate money amounts) that a telescoping constructor would be unreadable at
 * the call site — this makes each piece explicit and computes total once,
 * consistently, instead of every caller doing subtotal-discount+shipping by hand.
 */
public class OrderBuilder {

    private UUID userId;
    private String orderNumber;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private List<OrderItem> items;
    private BigDecimal subtotal;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal shippingFee = BigDecimal.ZERO;

    public OrderBuilder userId(UUID userId) {
        this.userId = userId;
        return this;
    }

    public OrderBuilder orderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
        return this;
    }

    public OrderBuilder shippingDetails(String name, String phone, String address) {
        this.shippingName = name;
        this.shippingPhone = phone;
        this.shippingAddress = address;
        return this;
    }

    public OrderBuilder items(List<OrderItem> items) {
        this.items = items;
        return this;
    }

    public OrderBuilder subtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
        return this;
    }

    public OrderBuilder discount(BigDecimal discount) {
        this.discount = discount;
        return this;
    }

    public OrderBuilder shippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
        return this;
    }

    public Order build() {
        if (userId == null || orderNumber == null || items == null || subtotal == null) {
            throw new IllegalStateException("OrderBuilder: userId, orderNumber, items and subtotal are required");
        }

        Order order = new Order();
        OffsetDateTime now = OffsetDateTime.now();
        order.setUserId(userId);
        order.setOrderNumber(orderNumber);
        order.setStatus(OrderStatus.PENDING);
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setShippingFee(shippingFee);
        order.setTotal(subtotal.subtract(discount).add(shippingFee));
        order.setShippingName(shippingName);
        order.setShippingPhone(shippingPhone);
        order.setShippingAddress(shippingAddress);
        order.setCreatedAt(now);
        order.setUpdatedAt(now);

        items.forEach(item -> item.setOrder(order));
        order.setItems(items);

        return order;
    }
}
