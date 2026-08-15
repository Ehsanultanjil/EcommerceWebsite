package com.nova.observer;

import com.nova.entity.Order;
import com.nova.entity.OrderStatus;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Subject: Spring autowires every OrderObserver bean into this list automatically —
 * adding a new observer (e.g. a real EmailNotificationObserver later) means writing
 * the class and nothing else; OrderService never needs to know it exists.
 */
@Component
public class OrderEventPublisher {

    private final List<OrderObserver> observers;

    public OrderEventPublisher(List<OrderObserver> observers) {
        this.observers = observers;
    }

    public void publish(Order order, OrderStatus previousStatus) {
        observers.forEach(observer -> observer.onOrderStatusChanged(order, previousStatus));
    }
}
