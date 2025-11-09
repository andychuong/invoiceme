package com.invoiceme.infrastructure.api.controller;

import com.invoiceme.domain.user.User;
import com.invoiceme.infrastructure.api.dto.user.UserProfileRequestDTO;
import com.invoiceme.infrastructure.api.dto.user.UserProfileResponseDTO;
import com.invoiceme.infrastructure.config.security.CustomUserDetails;
import com.invoiceme.infrastructure.persistence.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> getCurrentUser(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(mapToResponseDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> updateCurrentUser(
            @Valid @RequestBody UserProfileRequestDTO request,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if email is being changed and if it's already taken
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().build();
            }
        }

        user.updateProfile(request.getDisplayName(), request.getEmail(), request.getProfilePictureUrl());
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(mapToResponseDTO(savedUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponseDTO> getUser(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(mapToResponseDTO(user));
    }

    private UserProfileResponseDTO mapToResponseDTO(User user) {
        return UserProfileResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

