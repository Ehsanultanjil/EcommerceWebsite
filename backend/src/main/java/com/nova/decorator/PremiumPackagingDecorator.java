package com.nova.decorator;

import java.math.BigDecimal;

public class PremiumPackagingDecorator extends ProductAddOnDecorator {

    private static final BigDecimal COST = new BigDecimal("150");

    public PremiumPackagingDecorator(PricedComponent wrapped) {
        super(wrapped);
    }

    @Override
    public BigDecimal getPrice() {
        return wrapped.getPrice().add(COST);
    }

    @Override
    public String getDescription() {
        return wrapped.getDescription() + " + Premium Packaging";
    }
}
