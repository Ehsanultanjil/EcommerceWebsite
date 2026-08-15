package com.nova.adapter;

import java.math.BigDecimal;

/** The interface OUR code depends on — kept stable even if the underlying vendor changes. */
public interface PaymentGatewayAdapter {
    GatewayChargeResult charge(BigDecimal amount, String currency);
}
