package com.nova.strategy;

import java.math.BigDecimal;

/** Used whenever no coupon is applied — coupon validation itself is a later phase. */
public class NoDiscountStrategy implements DiscountStrategy {
    @Override
    public BigDecimal apply(BigDecimal subtotal) {
        return BigDecimal.ZERO;
    }
}
