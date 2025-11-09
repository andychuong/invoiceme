package com.invoiceme.infrastructure.config.security;

import com.invoiceme.domain.user.CompanyMembership;
import com.invoiceme.domain.user.User;
import com.invoiceme.infrastructure.persistence.CompanyMembershipRepository;
import com.invoiceme.infrastructure.persistence.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);
    
    private final UserRepository userRepository;
    private final CompanyMembershipRepository membershipRepository;

    public CustomUserDetailsService(UserRepository userRepository, 
                                   CompanyMembershipRepository membershipRepository) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Loading user by username: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        log.info("Found user: {}, password hash starts with: {}", user.getUsername(), 
                user.getPassword().substring(0, Math.min(20, user.getPassword().length())));

        List<CompanyMembership> memberships = membershipRepository.findByUserId(user.getId());
        log.info("Found {} memberships for user", memberships.size());

        CustomUserDetails userDetails = new CustomUserDetails(user, memberships);
        log.info("Created CustomUserDetails with authorities: {}", userDetails.getAuthorities());
        
        return userDetails;
    }
}

