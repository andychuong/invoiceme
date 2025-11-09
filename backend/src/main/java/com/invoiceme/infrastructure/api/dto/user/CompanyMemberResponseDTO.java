package com.invoiceme.infrastructure.api.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyMemberResponseDTO {
    private UUID id;
    private UUID userId;
    private String username;
    private String email;
    private String displayName;
    private String profilePictureUrl;
    private String role;
    private LocalDateTime joinedAt;
}

