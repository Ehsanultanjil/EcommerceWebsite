package com.nova.strategy;

import java.math.BigDecimal;

public class StandardShippingStrategy implements ShippingStrategy {

    private final BigDecimal flatFee;

    public StandardShippingStrategy(BigDecimal flatFee) {
        this.flatFee = flatFee;
    }

    @Override
    public BigDecimal calculate(BigDecimal subtotal) {
        return flatFee;
    }
}
