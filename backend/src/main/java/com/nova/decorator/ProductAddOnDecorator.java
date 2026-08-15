package com.nova.decorator;

/**
 * Decorator: each add-on wraps the component it decorates instead of the
 * product needing a GiftWrappedProduct / WarrantiedProduct / GiftWrappedWithWarrantyProduct
 * subclass per combination — add-ons stack in any order, any combination, with
 * no new classes per combination.
 */
public abstract class ProductAddOnDecorator implements PricedComponent {

    protected final PricedComponent wrapped;

    protected ProductAddOnDecorator(PricedComponent wrapped) {
        this.wrapped = wrapped;
    }
}
