package com.nova.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Adapter: translates our internal charge(BigDecimal, String) call into the
 * external SDK's makeTransaction(double cents, String currency) shape, and
 * translates its ExternalChargeResponse back into our GatewayChargeResult —
 * so PaymentFactory's card/mobile processors never touch vendor-specific types.
 */
@Component
@RequiredArgsConstructor
public class MockExternalPaymentAdapter implements PaymentGatewayAdapter {

    private final MockExternalPaymentApi externalApi;

    @Override
    public GatewayChargeResult charge(BigDecimal amount, String currency) {
        double amountInCents = amount.movePointRight(2).doubleValue();
        ExternalChargeResponse response = externalApi.makeTransaction(amountInCents, currency);
        return new GatewayChargeResult(response.success(), response.referenceId());
    }
}
