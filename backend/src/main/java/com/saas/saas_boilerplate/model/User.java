package com.saas.saas_boilerplate.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Builder.Default 
    private Role role = Role.USER;

    // Email verification
    @Builder.Default 
    private boolean verified = false;
    private String verificationToken;

    @Column(name = "created_at")
    @Builder.Default 
    private LocalDateTime createdAt = LocalDateTime.now();

    // Which company does this user belong to?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    public enum Role {
        USER, ADMIN, SUPER_ADMIN
    }
}