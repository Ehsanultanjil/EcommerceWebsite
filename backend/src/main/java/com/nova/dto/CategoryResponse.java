package com.nova.dto;

import com.nova.entity.Category;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        String slug,
        String imageUrl
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getImageUrl()
        );
    }
}
