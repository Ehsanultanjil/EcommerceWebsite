package com.nova.config;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

/** Reads the authenticated user's id out of the verified Supabase JWT's "sub" claim. */
public final class CurrentUser {

    private CurrentUser() {
    }

    public static UUID id(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
