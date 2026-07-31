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
public class PaymentMethodResponse {
    private String cardBrand;
    private String cardLastFour;
    private LocalDateTime addedAt;
}