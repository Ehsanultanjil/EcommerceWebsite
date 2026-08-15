package com.nova.observer;

import com.nova.entity.Order;
import com.nova.entity.OrderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** Stands in for a real email/SMS send — no notification provider wired up (out of scope). */
@Component
@Slf4j
public class CustomerNotificationObserver implements OrderObserver {
    @Override
    public void onOrderStatusChanged(Order order, OrderStatus previousStatus) {
        log.info("[customer-notify] Order #{} is now {} (was {}) — would email/SMS user {}",
                order.getOrderNumber(), order.getStatus(), previousStatus, order.getUserId());
    }
}
