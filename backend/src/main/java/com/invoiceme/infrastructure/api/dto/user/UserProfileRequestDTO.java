package com.invoiceme.infrastructure.api.dto.user;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequestDTO {
    private String displayName;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String profilePictureUrl;
}

