package com.nova.config;

import com.nova.entity.UserRole;
import com.nova.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Supabase's JWT only carries the Postgres-level role ("authenticated"), not our
 * application role (CUSTOMER/ADMIN) — that lives in public.profiles. This converter
 * looks it up post-verification and attaches it as a Spring Security authority so
 * @PreAuthorize("hasRole('ADMIN')") works. Missing profile (shouldn't happen given the
 * handle_new_user trigger, but defensive) falls back to CUSTOMER rather than failing
 * the whole request — endpoints that actually require the profile to exist will 404
 * on their own.
 */
@Component
@RequiredArgsConstructor
public class JwtRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final ProfileRepository profileRepository;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        UserRole role = profileRepository.findById(userId)
                .map(com.nova.entity.Profile::getRole)
                .orElse(UserRole.CUSTOMER);

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
        return new JwtAuthenticationToken(jwt, authorities);
    }
}
