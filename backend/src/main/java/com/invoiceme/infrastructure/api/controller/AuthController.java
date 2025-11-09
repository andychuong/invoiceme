package com.invoiceme.infrastructure.api.controller;

import com.invoiceme.domain.company.Company;
import com.invoiceme.domain.user.CompanyMembership;
import com.invoiceme.domain.user.User;
import com.invoiceme.infrastructure.api.dto.auth.JoinCompanyRequestDTO;
import com.invoiceme.infrastructure.api.dto.auth.LoginRequestDTO;
import com.invoiceme.infrastructure.api.dto.auth.LoginResponseDTO;
import com.invoiceme.infrastructure.api.dto.auth.SignupRequestDTO;
import com.invoiceme.infrastructure.config.security.CustomUserDetails;
import com.invoiceme.infrastructure.config.security.JwtTokenProvider;
import com.invoiceme.infrastructure.persistence.CompanyMembershipRepository;
import com.invoiceme.infrastructure.persistence.CompanyRepository;
import com.invoiceme.infrastructure.persistence.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final Long jwtExpiration;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CompanyMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            @Value("${jwt.expiration}") Long jwtExpiration,
            UserRepository userRepository,
            CompanyRepository companyRepository,
            CompanyMembershipRepository membershipRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtExpiration = jwtExpiration;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Get default company membership
        CompanyMembership defaultMembership = userDetails.getMemberships().isEmpty() 
                ? null : userDetails.getMemberships().get(0);
        
        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(token)
                .expiresIn(jwtExpiration)
                .userId(userDetails.getUserId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .displayName(userDetails.getDisplayName())
                .profilePictureUrl(userDetails.getProfilePictureUrl())
                .companyId(defaultMembership != null ? defaultMembership.getCompany().getId() : null)
                .companyName(defaultMembership != null ? defaultMembership.getCompany().getName() : null)
                .companyLogoUrl(defaultMembership != null ? defaultMembership.getCompany().getLogoUrl() : null)
                .role(defaultMembership != null ? defaultMembership.getRole().name() : null)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequestDTO request) {
        // Check if username or email already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .displayName(request.getDisplayName())
                .build();
        user = userRepository.save(user);

        // Create new company with generated company code
        Company company = Company.builder()
                .name(request.getCompanyName())
                .build();
        company = companyRepository.save(company);

        // Create company membership with ADMIN role
        CompanyMembership membership = CompanyMembership.builder()
                .user(user)
                .company(company)
                .role(CompanyMembership.Role.ADMIN)
                .build();
        membershipRepository.save(membership);

        // Auto-login after signup
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(token)
                .expiresIn(jwtExpiration)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .companyId(company.getId())
                .companyName(company.getName())
                .companyLogoUrl(company.getLogoUrl())
                .role(CompanyMembership.Role.ADMIN.name())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/join")
    @Transactional
    public ResponseEntity<?> joinCompany(@Valid @RequestBody JoinCompanyRequestDTO request) {
        // Check if username or email already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        // Find company by code
        Company company = companyRepository.findByCompanyCode(request.getCompanyCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid company code"));

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .displayName(request.getDisplayName())
                .build();
        user = userRepository.save(user);

        // Create company membership with OPERATOR role (default for joining)
        CompanyMembership membership = CompanyMembership.builder()
                .user(user)
                .company(company)
                .role(CompanyMembership.Role.OPERATOR)
                .build();
        membershipRepository.save(membership);

        // Auto-login after joining
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(token)
                .expiresIn(jwtExpiration)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .companyId(company.getId())
                .companyName(company.getName())
                .companyLogoUrl(company.getLogoUrl())
                .role(CompanyMembership.Role.OPERATOR.name())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

