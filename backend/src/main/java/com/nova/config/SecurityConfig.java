package com.nova.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtRoleConverter jwtRoleConverter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    /**
     * Spring's default NimbusJwtDecoder (built purely from the jwk-set-uri property)
     * only trusts RS256 unless told otherwise — Supabase signs with ES256, so the
     * default silently rejects every real token ("Another algorithm expected").
     * Explicit algorithm here is what actually makes verification work.
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri)
                .jwsAlgorithm(SignatureAlgorithm.ES256)
                .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Explicit CorsConfigurationSource bean (not just a WebMvcConfigurer) —
                // Security's filter chain runs before MVC, so without this, a CORS
                // preflight OPTIONS request to a protected route gets challenged by
                // .anyRequest().authenticated() before CORS headers are ever attached,
                // and the browser reports the whole thing as a CORS failure.
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // Stateless bearer-token API — no browser form/cookie flows, so CSRF
                // protection (which exists to defend session-cookie auth) doesn't apply.
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("GET", "/api/products/**").permitAll()
                        .requestMatchers("GET", "/api/categories/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtRoleConverter))
                );
        return http.build();
    }
}
