package com.nova.decorator;

import java.math.BigDecimal;

public class GiftWrapDecorator extends ProductAddOnDecorator {

    private static final BigDecimal COST = new BigDecimal("100");

    public GiftWrapDecorator(PricedComponent wrapped) {
        super(wrapped);
    }

    @Override
    public BigDecimal getPrice() {
        return wrapped.getPrice().add(COST);
    }

    @Override
    public String getDescription() {
        return wrapped.getDescription() + " + Gift Wrapping";
    }
}
