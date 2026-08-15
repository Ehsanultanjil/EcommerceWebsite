package com.nova.decorator;

import com.nova.entity.Product;

import java.math.BigDecimal;

/** The plain, undecorated component — a product at its catalog price. */
public class BaseProductPrice implements PricedComponent {

    private final Product product;

    public BaseProductPrice(Product product) {
        this.product = product;
    }

    @Override
    public BigDecimal getPrice() {
        return product.getPrice();
    }

    @Override
    public String getDescription() {
        return product.getName();
    }
}
