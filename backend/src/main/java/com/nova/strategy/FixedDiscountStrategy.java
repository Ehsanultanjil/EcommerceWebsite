package com.nova.strategy;

import java.math.BigDecimal;

public class FixedDiscountStrategy implements DiscountStrategy {

    private final BigDecimal amount;

    public FixedDiscountStrategy(BigDecimal amount) {
        this.amount = amount;
    }

    @Override
    public BigDecimal apply(BigDecimal subtotal) {
        // Never discount past zero.
        return amount.min(subtotal);
    }
}
