package com.nova.factory;

import com.nova.adapter.PaymentGatewayAdapter;
import com.nova.entity.PaymentMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Factory Method: the checkout Facade asks for "a processor for this payment
 * method" and gets back a PaymentProcessor — it never names CardPaymentProcessor
 * or MobilePaymentProcessor directly, so adding a new payment method later means
 * adding one case here, not touching checkout logic.
 */
@Component
@RequiredArgsConstructor
public class PaymentFactory {

    private final PaymentGatewayAdapter gatewayAdapter;

    public PaymentProcessor create(PaymentMethod method) {
        return switch (method) {
            case CASH_ON_DELIVERY -> new CashOnDeliveryProcessor();
            case CARD -> new CardPaymentProcessor(gatewayAdapter);
            case MOBILE_PAYMENT -> new MobilePaymentProcessor(gatewayAdapter);
        };
    }
}
