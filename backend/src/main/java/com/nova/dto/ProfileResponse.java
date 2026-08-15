package com.nova.dto;

import com.nova.entity.Profile;
import com.nova.entity.UserRole;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String fullName,
        String email,
        String phone,
        UserRole role,
        String avatarUrl,
        OffsetDateTime createdAt
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getFullName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getRole(),
                profile.getAvatarUrl(),
                profile.getCreatedAt()
        );
    }
}
