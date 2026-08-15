package com.nova.controller;

import com.nova.config.CurrentUser;
import com.nova.dto.ProfileResponse;
import com.nova.exception.ResourceNotFoundException;
import com.nova.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ProfileRepository profileRepository;

    @GetMapping("/me")
    public ProfileResponse me(@AuthenticationPrincipal Jwt jwt) {
        return profileRepository.findById(CurrentUser.id(jwt))
                .map(ProfileResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }
}
