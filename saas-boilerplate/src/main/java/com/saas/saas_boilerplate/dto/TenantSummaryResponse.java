package com.saas.saas_boilerplate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TenantSummaryResponse {
    private Long id;
    private String name;
    private String plan;
    private Long userCount;
    private Long apiCallCount;
}