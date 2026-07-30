package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.*;
import com.saas.saas_boilerplate.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor

public class BillingController {

    private final BillingService billingService;

    // Any authenticated user in the tenant can view billing status.
    @GetMapping("/subscription")
    public ResponseEntity<SubscriptionResponse> getSubscription() {
        return ResponseEntity.ok(billingService.getMySubscription());
    }

    // Only ADMIN/SUPER_ADMIN can change the tenant's plan.
    @PostMapping("/subscription/change-plan")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<SubscriptionResponse> changePlan(@Valid @RequestBody ChangePlanRequest request) {
        return ResponseEntity.ok(billingService.changePlan(request));
    }

    @PostMapping("/subscription/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<SubscriptionResponse> cancelSubscription() {
        return ResponseEntity.ok(billingService.cancelSubscription());
    }

    @PostMapping("/payment-method")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<PaymentMethodResponse> addPaymentMethod(@Valid @RequestBody PaymentMethodRequest request) {
        return ResponseEntity.ok(billingService.addPaymentMethod(request));
    }

    @GetMapping("/payment-method")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethod() {
        return ResponseEntity.ok(billingService.getMyPaymentMethod());
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceResponse>> getMyInvoices() {
        return ResponseEntity.ok(billingService.getMyInvoices());
    }

    // SUPER_ADMIN: invoices across every tenant in the system.
    @GetMapping("/invoices/all")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices() {
        return ResponseEntity.ok(billingService.getAllInvoices());
    }
}