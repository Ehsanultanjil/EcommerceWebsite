package com.nova.dto;

import java.math.BigDecimal;

public record PricePreviewResponse(
        String description,
        BigDecimal basePrice,
        BigDecimal finalPrice
) {
}
