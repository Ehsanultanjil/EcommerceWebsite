package com.nova.observer;

import com.nova.entity.Order;
import com.nova.entity.OrderStatus;

public interface OrderObserver {
    void onOrderStatusChanged(Order order, OrderStatus previousStatus);
}
