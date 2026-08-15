package com.nova.strategy;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ShippingStrategySelector {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("15000");
    private static final BigDecimal STANDARD_FEE = new BigDecimal("1000");

    public ShippingStrategy select(BigDecimal subtotal) {
        return subtotal.compareTo(FREE_SHIPPING_THRESHOLD) > 0
                ? new FreeShippingStrategy()
                : new StandardShippingStrategy(STANDARD_FEE);
    }
}
