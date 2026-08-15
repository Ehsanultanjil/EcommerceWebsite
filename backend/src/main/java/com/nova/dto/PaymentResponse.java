package com.nova.dto;

import com.nova.entity.Payment;
import com.nova.entity.PaymentMethod;
import com.nova.entity.PaymentStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        PaymentMethod method,
        PaymentStatus status,
        BigDecimal amount,
        String transactionReference
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getTransactionReference()
        );
    }
}
