package com.nova.factory;

import com.nova.entity.PaymentStatus;

public record PaymentResult(PaymentStatus status, String transactionReference) {
}
