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

<<<<<<< HEAD
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

=======
    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        Tenant tenant;
        User.Role role;

        // Check whether company already exists
        var existingTenant = tenantRepository.findByName(request.getCompanyName());

        if (existingTenant.isPresent()) {

            // Existing company
            tenant = existingTenant.get();

            // New registrations join as normal USER
            role = User.Role.USER;

        } else {

            // New company
            tenant = tenantRepository.save(
                    Tenant.builder()
                            .name(request.getCompanyName())
                            .plan(Tenant.Plan.FREE)
                            .build()
            );

            // First user becomes Tenant Admin
            role = User.Role.ADMIN;
        }

        // Verification token (for future email verification)
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

        // emailService.sendVerificationEmail(user.getEmail(), verificationToken);

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

        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + request.getPassword());

        // Step 1: Check if user exists in DB
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("ERROR: User not found in DB!");
                    return new RuntimeException("User not found");
                });

        System.out.println("✅ User found: " + user.getEmail());
        System.out.println("✅ Is verified: " + user.isVerified());

        // Step 2: Check if verified
        if (!user.isVerified()) {
            System.out.println("ERROR: Not verified!");
            throw new RuntimeException("Please verify your email!");
        }

        // Step 3: Try authentication
        System.out.println("Trying authenticationManager...");
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
<<<<<<< HEAD
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        } catch (DisabledException e) {
            throw new RuntimeException("Account is disabled");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        String token = jwtUtil.generateToken(user.getEmail());
=======
            System.out.println("✅ Authentication successful!");
        } catch (Exception e) {
            System.out.println("ERROR in auth: " + e.getClass().getName());
            System.out.println("ERROR message: " + e.getMessage());
            throw new RuntimeException("Auth failed: " + e.getMessage());
        }

        String token = jwtUtil.generateToken(user.getEmail());
        System.out.println("✅ Token generated!");
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
<<<<<<< HEAD
                .companyName(user.getTenant() != null ? user.getTenant().getName() : null)
=======
                .companyName(user.getTenant().getName())
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
                .message("Login successful!")
                .build();
    }

<<<<<<< HEAD
    @Transactional
    public String verifyEmail(String token) {

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification token"));

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "Email verified successfully! You can now log in.";
=======
    public String verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        user.setVerified(true);
        user.setVerificationToken(null); // clear token after use
        userRepository.save(user);

        return "Email verified successfully! You can now login.";
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
    }
}