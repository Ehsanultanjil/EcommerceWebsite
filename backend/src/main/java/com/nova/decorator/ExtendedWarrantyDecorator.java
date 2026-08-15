package com.nova.decorator;

import java.math.BigDecimal;

public class ExtendedWarrantyDecorator extends ProductAddOnDecorator {

    private static final BigDecimal COST = new BigDecimal("300");

    public ExtendedWarrantyDecorator(PricedComponent wrapped) {
        super(wrapped);
    }

    @Override
    public BigDecimal getPrice() {
        return wrapped.getPrice().add(COST);
    }

    @Override
    public String getDescription() {
        return wrapped.getDescription() + " + Extended Warranty";
    }
}
