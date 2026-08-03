package com.saas.saas_boilerplate.service;

import com.saas.saas_boilerplate.repository.UserRepository;
import com.saas.saas_boilerplate.dto.*;
import com.saas.saas_boilerplate.model.*;
import com.saas.saas_boilerplate.repository.*;
import com.saas.saas_boilerplate.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

   @Transactional
   public AuthResponse register(RegisterRequest request) {

    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already registered!");
    }

    Tenant tenant;
    User.Role role;

    var existingTenant =
            tenantRepository.findByName(request.getCompanyName());

    if (existingTenant.isPresent()) {

        tenant = existingTenant.get();
        role = User.Role.USER;

    } else {

        // Automatically create a unique domain
        String generatedDomain = request.getCompanyName()
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", "-")
                + ".local";

        tenant = tenantRepository.save(
                Tenant.builder()
                        .name(request.getCompanyName())
                        .domain(generatedDomain)
                        .plan(Tenant.Plan.FREE)
                        .status(Tenant.Status.ACTIVE)
                        .build()
        );

        role = User.Role.ADMIN;
    }

    String verificationToken = UUID.randomUUID().toString();

    User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(role)
            .verified(true)
            .verificationToken(null)
            .tenant(tenant)
            .build();

    userRepository.save(user);

    return AuthResponse.builder()
            .email(user.getEmail())
            .name(user.getName())
            .role(user.getRole().name())
            .companyName(user.getTenant().getName())
            .message(
                    role == User.Role.ADMIN
                            ? "Company created successfully! You are now the Tenant Admin."
                            : "Registration successful! Your account has been created."
            )
            .build();
}

    @Transactional
    public AuthResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        } catch (DisabledException e) {
            throw new RuntimeException("Account is disabled");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .companyName(user.getTenant() != null ? user.getTenant().getName() : null)
                .message("Login successful!")
                .build();
    }

    @Transactional
    public String verifyEmail(String token) {

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification token"));

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "Email verified successfully! You can now log in.";
    }
}