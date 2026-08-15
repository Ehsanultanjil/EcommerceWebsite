package com.nova.dto;

import com.nova.entity.Product;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProductResponse(
        UUID id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        BigDecimal comparePrice,
        Integer stock,
        String imageUrl,
        boolean featured,
        boolean isNew,
        boolean active,
        CategoryResponse category,
        List<ProductImageResponse> images,
        OffsetDateTime createdAt
) {
    /**
     * Maps the entity to a response DTO. Must be called while the JPA session is still
     * open (e.g. inside a @Transactional service method) since it touches the lazy
     * category/images associations.
     */
    public static ProductResponse from(Product product) {
        List<ProductImageResponse> imageResponses = product.getImages() == null
                ? List.of()
                : product.getImages().stream().map(ProductImageResponse::from).collect(Collectors.toList());

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getComparePrice(),
                product.getStock(),
                product.getImageUrl(),
                product.isFeatured(),
                product.isNew(),
                product.isActive(),
                CategoryResponse.from(product.getCategory()),
                imageResponses,
                product.getCreatedAt()
        );
    }
}
