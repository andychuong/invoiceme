package com.invoiceme.application.services;

import com.invoiceme.domain.company.Company;
import com.invoiceme.domain.user.CompanyMembership;
import com.invoiceme.domain.user.User;
import com.invoiceme.infrastructure.persistence.CompanyMembershipRepository;
import com.invoiceme.infrastructure.persistence.CompanyRepository;
import com.invoiceme.infrastructure.persistence.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final CompanyMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    public CompanyService(CompanyRepository companyRepository,
                         UserRepository userRepository,
                         CompanyMembershipRepository membershipRepository,
                         PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Company getCompanyById(UUID id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + id));
    }

    @Transactional
    public Company updateCompany(UUID id, String name, String logoUrl) {
        Company company = getCompanyById(id);
        company.updateName(name);
        company.updateLogoUrl(logoUrl);
        return companyRepository.save(company);
    }

    @Transactional(readOnly = true)
    public List<CompanyMembership> getCompanyMembers(UUID companyId) {
        return membershipRepository.findByCompanyId(companyId);
    }

    @Transactional
    public CompanyMembership inviteUser(UUID companyId, String username, String email, 
                                       String password, String displayName, String role) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        Company company = getCompanyById(companyId);

        // Create new user
        User newUser = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .displayName(displayName)
                .build();
        
        User savedUser = userRepository.save(newUser);

        // Create company membership
        CompanyMembership.Role membershipRole;
        try {
            membershipRole = CompanyMembership.Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            membershipRole = CompanyMembership.Role.OPERATOR;
        }

        CompanyMembership membership = CompanyMembership.builder()
                .user(savedUser)
                .company(company)
                .role(membershipRole)
                .build();
        
        return membershipRepository.save(membership);
    }

    @Transactional
    public void removeMember(UUID companyId, UUID userId, UUID requestingUserId) {
        // Don't allow removing yourself
        if (requestingUserId.equals(userId)) {
            throw new IllegalArgumentException("Cannot remove yourself from the company");
        }

        CompanyMembership membership = membershipRepository.findByUserIdAndCompanyId(userId, companyId)
                .orElseThrow(() -> new IllegalArgumentException("Membership not found"));

        membershipRepository.delete(membership);
    }

    @Transactional
    public Company regenerateCompanyCode(UUID companyId) {
        Company company = getCompanyById(companyId);
        company.regenerateCompanyCode();
        return companyRepository.save(company);
    }

    @Transactional(readOnly = true)
    public boolean isUserAdminOfCompany(UUID userId, UUID companyId) {
        return membershipRepository.findByUserIdAndCompanyId(userId, companyId)
                .map(CompanyMembership::isAdmin)
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public boolean hasUserAccessToCompany(UUID userId, UUID companyId) {
        return membershipRepository.findByUserIdAndCompanyId(userId, companyId)
                .isPresent();
    }
}

