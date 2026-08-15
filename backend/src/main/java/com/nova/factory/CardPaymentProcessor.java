package com.nova.factory;

import com.nova.adapter.GatewayChargeResult;
import com.nova.adapter.PaymentGatewayAdapter;
import com.nova.entity.PaymentStatus;

import java.math.BigDecimal;

public class CardPaymentProcessor implements PaymentProcessor {

    private final PaymentGatewayAdapter gatewayAdapter;

    public CardPaymentProcessor(PaymentGatewayAdapter gatewayAdapter) {
        this.gatewayAdapter = gatewayAdapter;
    }

    @Override
    public PaymentResult process(BigDecimal amount) {
        GatewayChargeResult result = gatewayAdapter.charge(amount, "BDT");
        return new PaymentResult(
                result.success() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
                result.transactionReference()
        );
    }
}
