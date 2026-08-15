package com.nova.observer;

import com.nova.entity.Order;
import com.nova.entity.OrderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AdminNotificationObserver implements OrderObserver {
    @Override
    public void onOrderStatusChanged(Order order, OrderStatus previousStatus) {
        if (previousStatus == null) {
            log.info("[admin-notify] New order #{} placed — total {}", order.getOrderNumber(), order.getTotal());
        } else {
            log.info("[admin-notify] Order #{} moved {} -> {}", order.getOrderNumber(), previousStatus, order.getStatus());
        }
    }
}
