package com.nova.strategy;

import java.math.BigDecimal;

public interface DiscountStrategy {
    BigDecimal apply(BigDecimal subtotal);
}
