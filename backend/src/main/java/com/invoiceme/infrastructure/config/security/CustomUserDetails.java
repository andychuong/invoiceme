package com.invoiceme.infrastructure.config.security;

import com.invoiceme.domain.user.CompanyMembership;
import com.invoiceme.domain.user.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {
    private final UUID userId;
    private final String username;
    private final String password;
    private final String email;
    private final String displayName;
    private final String profilePictureUrl;
    private final List<CompanyMembership> memberships;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user, List<CompanyMembership> memberships) {
        this.userId = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
        this.displayName = user.getDisplayName();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.memberships = memberships;
        
        // Build authorities from memberships
        this.authorities = memberships.stream()
                .map(m -> new SimpleGrantedAuthority("ROLE_" + m.getRole().name()))
                .collect(Collectors.toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public UUID getDefaultCompanyId() {
        return memberships.isEmpty() ? null : memberships.get(0).getCompany().getId();
    }

    public CompanyMembership.Role getRoleForCompany(UUID companyId) {
        return memberships.stream()
                .filter(m -> m.getCompany().getId().equals(companyId))
                .findFirst()
                .map(CompanyMembership::getRole)
                .orElse(null);
    }
}

