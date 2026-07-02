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

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default 
    private Plan plan = Plan.FREE;

    @Column(name = "created_at")
    @Builder.Default 
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Plan {
        FREE, BASIC, PRO
    }
}