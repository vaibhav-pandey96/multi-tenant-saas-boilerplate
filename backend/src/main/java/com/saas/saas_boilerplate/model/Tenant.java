package com.saas.saas_boilerplate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
    // Company Name
    @Column(nullable = false, unique = true)
    private String name;

    // Tenant Domain
    @Column(nullable = false, unique = true)
    private String domain;

=======
    @Column(nullable = false, unique = true)
    private String name;

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
    // Subscription Plan
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Plan plan = Plan.FREE;

    // Tenant Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Plan {
        FREE,
        BASIC,
        PRO,
        ENTERPRISE
    }

    public enum Status {
        ACTIVE,
        SUSPENDED,
        TRIAL
    }
}