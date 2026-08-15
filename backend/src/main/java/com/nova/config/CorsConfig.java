package com.nova.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Explicit-origin CORS (never "*") so this stays safe once auth/cookies are added in a
 * later phase. Allowed origins are property-driven — add the Vercel frontend URL via
 * app.cors.allowed-origins (see application.properties) instead of touching this class.
 *
 * Exposed as a CorsConfigurationSource bean (not a WebMvcConfigurer) because
 * SecurityConfig's http.cors(...) needs an actual bean to wire into the security
 * filter chain — a plain WebMvcConfigurer registration runs too late to cover
 * preflight OPTIONS requests once Spring Security is on the classpath.
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
