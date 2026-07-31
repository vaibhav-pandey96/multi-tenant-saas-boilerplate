package com.saas.saas_boilerplate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PaymentMethodRequest {
    // Mock input only — a real integration would use a client-side token (e.g. Stripe.js),
    // never a raw card number, even over HTTPS.
    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "\\d{12,19}", message = "Enter a valid card number")
    private String cardNumber;

    @NotBlank(message = "Card brand is required")
    private String cardBrand; // VISA, MASTERCARD, AMEX, etc.
}