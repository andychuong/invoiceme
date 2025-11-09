package com.invoiceme.infrastructure.api.controller;

import com.invoiceme.application.services.CompanyService;
import com.invoiceme.domain.company.Company;
import com.invoiceme.domain.user.CompanyMembership;
import com.invoiceme.domain.user.User;
import com.invoiceme.infrastructure.api.dto.company.CompanyRequestDTO;
import com.invoiceme.infrastructure.api.dto.company.CompanyResponseDTO;
import com.invoiceme.infrastructure.api.dto.user.CompanyMemberResponseDTO;
import com.invoiceme.infrastructure.api.dto.user.InviteUserRequestDTO;
import com.invoiceme.infrastructure.config.security.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponseDTO> getCompany(@PathVariable UUID id, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Verify user has access to this company
        if (!companyService.hasUserAccessToCompany(userDetails.getUserId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Company company = companyService.getCompanyById(id);
        return ResponseEntity.ok(mapToResponseDTO(company));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponseDTO> updateCompany(
            @PathVariable UUID id,
            @Valid @RequestBody CompanyRequestDTO request,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Verify user is admin of this company
        if (!companyService.isUserAdminOfCompany(userDetails.getUserId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Company company = companyService.updateCompany(id, request.getName(), request.getLogoUrl());
        return ResponseEntity.ok(mapToResponseDTO(company));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<CompanyMemberResponseDTO>> getCompanyMembers(
            @PathVariable UUID id,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Verify user has access to this company
        if (!companyService.hasUserAccessToCompany(userDetails.getUserId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<CompanyMembership> memberships = companyService.getCompanyMembers(id);
        List<CompanyMemberResponseDTO> members = memberships.stream()
                .map(this::mapToMemberResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(members);
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<CompanyMemberResponseDTO> inviteUser(
            @PathVariable UUID id,
            @Valid @RequestBody InviteUserRequestDTO request,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Verify user is admin of this company
        if (!companyService.isUserAdminOfCompany(userDetails.getUserId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            CompanyMembership membership = companyService.inviteUser(
                id,
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getDisplayName(),
                request.getRole()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToMemberResponseDTO(membership));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{companyId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID companyId,
            @PathVariable UUID userId,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Verify user is admin of this company
        if (!companyService.isUserAdminOfCompany(userDetails.getUserId(), companyId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            companyService.removeMember(companyId, userId, userDetails.getUserId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/{id}/regenerate-code")
    public ResponseEntity<CompanyResponseDTO> regenerateCompanyCode(
            @PathVariable UUID id,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Verify user is admin of this company
        if (!companyService.isUserAdminOfCompany(userDetails.getUserId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Company company = companyService.regenerateCompanyCode(id);
        return ResponseEntity.ok(mapToResponseDTO(company));
    }

    private CompanyResponseDTO mapToResponseDTO(Company company) {
        return CompanyResponseDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .logoUrl(company.getLogoUrl())
                .companyCode(company.getCompanyCode())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

    private CompanyMemberResponseDTO mapToMemberResponseDTO(CompanyMembership membership) {
        User user = membership.getUser();
        return CompanyMemberResponseDTO.builder()
                .id(membership.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(membership.getRole().name())
                .joinedAt(membership.getCreatedAt())
                .build();
    }
}
