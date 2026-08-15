package com.nova.strategy;

import java.math.BigDecimal;

public interface ShippingStrategy {
    BigDecimal calculate(BigDecimal subtotal);
}
