package com.nova.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

/** Used for both create (POST) and full update (PUT) of a product — admin only. */
public record ProductRequest(
        @NotNull UUID categoryId,
        @NotBlank String name,
        @NotBlank String slug,
        String description,
        @NotNull @DecimalMin(value = "0", inclusive = true) BigDecimal price,
        @DecimalMin(value = "0", inclusive = true) BigDecimal comparePrice,
        @NotNull @Min(0) Integer stock,
        String imageUrl,
        boolean featured,
        boolean isNew,
        boolean active
) {
}
