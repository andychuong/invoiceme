package com.invoiceme.infrastructure.api.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequestDTO {
    @NotBlank(message = "Company name is required")
    private String name;
    
    private String logoUrl;
}

