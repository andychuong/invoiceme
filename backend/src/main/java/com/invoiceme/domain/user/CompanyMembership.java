package com.invoiceme.domain.user;

import com.invoiceme.domain.company.Company;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "company_memberships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (role == null) {
            role = Role.OPERATOR;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void updateRole(Role newRole) {
        if (newRole == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        this.role = newRole;
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    public boolean isAccountant() {
        return role == Role.ACCOUNTANT;
    }

    public boolean isOperator() {
        return role == Role.OPERATOR;
    }

    public enum Role {
        ADMIN,      // Can manage company settings, invite users, full access
        ACCOUNTANT, // Can manage invoices, payments, customers
        OPERATOR    // Can create invoices, view customers
    }
}

