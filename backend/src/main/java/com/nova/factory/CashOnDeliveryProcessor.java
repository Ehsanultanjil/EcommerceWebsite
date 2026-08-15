package com.nova.factory;

import com.nova.entity.PaymentStatus;

import java.math.BigDecimal;

/** Cash never actually moves at checkout time — genuinely PENDING until the courier collects it. */
public class CashOnDeliveryProcessor implements PaymentProcessor {
    @Override
    public PaymentResult process(BigDecimal amount) {
        return new PaymentResult(PaymentStatus.PENDING, null);
    }
}
