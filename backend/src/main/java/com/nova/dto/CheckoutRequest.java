package com.nova.dto;

import com.nova.entity.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(
        @NotBlank String shippingName,
        @NotBlank String shippingPhone,
        @NotBlank String shippingAddress,
        @NotNull PaymentMethod paymentMethod
) {
}
