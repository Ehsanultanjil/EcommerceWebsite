package com.nova.factory;

import java.math.BigDecimal;

/** Common interface the checkout Facade codes against — never a concrete payment type. */
public interface PaymentProcessor {
    PaymentResult process(BigDecimal amount);
}
