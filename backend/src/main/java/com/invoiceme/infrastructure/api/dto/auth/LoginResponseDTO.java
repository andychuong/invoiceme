package com.invoiceme.infrastructure.api.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private Long expiresIn;
    private UUID userId;
    private String username;
    private String email;
    private String displayName;
    private String profilePictureUrl;
    private UUID companyId;
    private String companyName;
    private String companyLogoUrl;
    private String role;
}

