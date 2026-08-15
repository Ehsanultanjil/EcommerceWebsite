package com.nova.dto;

import com.nova.entity.ProductImage;

import java.util.UUID;

public record ProductImageResponse(
        UUID id,
        String imageUrl,
        Integer displayOrder
) {
    public static ProductImageResponse from(ProductImage image) {
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getDisplayOrder()
        );
    }
}
