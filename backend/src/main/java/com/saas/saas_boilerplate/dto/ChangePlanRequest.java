package com.saas.saas_boilerplate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePlanRequest {
    @NotBlank(message = "Plan is required")
    private String plan; // FREE, BASIC, PRO
}