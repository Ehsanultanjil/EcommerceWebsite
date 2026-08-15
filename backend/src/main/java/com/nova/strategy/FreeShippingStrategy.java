package com.nova.strategy;

import java.math.BigDecimal;

public class FreeShippingStrategy implements ShippingStrategy {
    @Override
    public BigDecimal calculate(BigDecimal subtotal) {
        return BigDecimal.ZERO;
    }
}
