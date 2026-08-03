package com.saas.saas_boilerplate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TenantSummaryResponse {

    private Long id;

    // Company Information
    private String name;
    private String plan;
    private String status;

    // Statistics
    private Long userCount;
    private Long apiCallCount;

    // Metadata
    private LocalDateTime createdAt;
}