package com.saas.saas_boilerplate.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false, unique = true)
    private Tenant tenant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BillingCycle billingCycle = BillingCycle.MONTHLY;

    @Column(name = "current_period_start")
    @Builder.Default
    private LocalDateTime currentPeriodStart = LocalDateTime.now();

    @Column(name = "current_period_end")
    @Builder.Default
    private LocalDateTime currentPeriodEnd = LocalDateTime.now().plusMonths(1);

    @Column(name = "cancel_at_period_end")
    @Builder.Default
    private boolean cancelAtPeriodEnd = false;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        ACTIVE, PAST_DUE, CANCELED
    }

    public enum BillingCycle {
        MONTHLY, ANNUAL
    }
}