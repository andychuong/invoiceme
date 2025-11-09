package com.invoiceme.infrastructure.api.dto.company;

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
public class CompanyResponseDTO {
    private UUID id;
    private String name;
    private String logoUrl;
    private UUID companyCode;  // Share this with employees to join
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

