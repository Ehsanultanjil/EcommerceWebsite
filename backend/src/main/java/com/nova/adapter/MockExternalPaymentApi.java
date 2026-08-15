package com.nova.adapter;

import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Stands in for a real third-party payment SDK (Stripe/SSLCommerz/bKash, etc).
 * Deliberately shaped the way an external vendor library actually looks — a
 * different method name, amount in cents as a double, currency as a separate
 * argument — so PaymentGatewayAdapter has a real incompatibility to bridge
 * instead of a trivial one. No real gateway integration (out of scope).
 */
@Component
public class MockExternalPaymentApi {

    public ExternalChargeResponse makeTransaction(double amountInCents, String currencyCode) {
        // Mock: always succeeds instantly, no real network call.
        return new ExternalChargeResponse(true, "MOCK-" + UUID.randomUUID());
    }
}
