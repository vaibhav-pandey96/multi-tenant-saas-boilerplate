package com.saas.saas_boilerplate.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false)
    private BigDecimal baseAmount;

    @Column(nullable = false)
    private BigDecimal usageAmount;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "api_call_count", nullable = false)
    private long apiCallCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.PAID;

    @Column(name = "period_start", nullable = false)
    private LocalDateTime periodStart;

    @Column(name = "period_end", nullable = false)
    private LocalDateTime periodEnd;

    @Column(name = "issued_at")
    @Builder.Default
    private LocalDateTime issuedAt = LocalDateTime.now();

    public enum Status {
        PAID, PENDING, FAILED
    }
}