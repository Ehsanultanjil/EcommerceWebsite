package com.nova.observer;

import com.nova.entity.Order;
import com.nova.entity.OrderStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Notification-only — the actual stock mutation on cancellation stays as explicit
 * business logic in OrderService (a silent side effect hidden inside an observer
 * would be surprising and hard to trace). This just flags the event for whatever
 * inventory system would care about it.
 */
@Component
@Slf4j
public class InventoryObserver implements OrderObserver {
    @Override
    public void onOrderStatusChanged(Order order, OrderStatus previousStatus) {
        if (order.getStatus() == OrderStatus.CANCELLED) {
            log.info("[inventory] Order #{} cancelled — stock already restored by OrderService", order.getOrderNumber());
        } else if (previousStatus == null) {
            log.info("[inventory] Order #{} placed — stock reserved", order.getOrderNumber());
        }
    }
}
