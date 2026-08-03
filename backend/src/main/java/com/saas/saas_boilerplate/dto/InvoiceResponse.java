package com.saas.saas_boilerplate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceResponse {
    private Long id;
    private String tenantName;
    private BigDecimal baseAmount;
    private BigDecimal usageAmount;
    private BigDecimal totalAmount;
    private long apiCallCount;
    private String status;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private LocalDateTime issuedAt;
}