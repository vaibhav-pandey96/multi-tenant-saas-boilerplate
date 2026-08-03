package com.saas.saas_boilerplate.service;

import com.saas.saas_boilerplate.dto.*;
import com.saas.saas_boilerplate.model.*;
import com.saas.saas_boilerplate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final ApiUsageLogRepository apiUsageLogRepository;

    // Mock monthly base price per plan
    private static final BigDecimal FREE_PRICE = BigDecimal.ZERO;
    private static final BigDecimal BASIC_PRICE = new BigDecimal("29.00");
    private static final BigDecimal PRO_PRICE = new BigDecimal("99.00");
    private static final BigDecimal ENTERPRISE_PRICE = new BigDecimal("299.00");

    // Mock overage price per API call once a tenant is on a paid plan
    private static final BigDecimal PRICE_PER_CALL = new BigDecimal("0.001");

    private Tenant currentTenant() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getTenant();
    }

    @Transactional
    public SubscriptionResponse getMySubscription() {
        Tenant tenant = currentTenant();
        Subscription subscription = subscriptionRepository.findByTenant(tenant)
                .orElseGet(() -> createDefaultSubscription(tenant));
        return toResponse(subscription);
    }

    @Transactional
    public SubscriptionResponse changePlan(ChangePlanRequest request) {
<<<<<<< HEAD
        Tenant tenant = currentTenant();

        Tenant.Plan newPlan;
        try {
            newPlan = Tenant.Plan.valueOf(request.getPlan().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid plan: " + request.getPlan());
        }

        tenant.setPlan(newPlan);
        tenantRepository.save(tenant);

        Subscription subscription = subscriptionRepository.findByTenant(tenant)
                .orElseGet(() -> createDefaultSubscription(tenant));

        subscription.setStatus(Subscription.Status.ACTIVE);
        subscription.setCancelAtPeriodEnd(false);
=======

        Tenant tenant = currentTenant();

        Tenant.Plan newPlan;

        try {

            newPlan = Tenant.Plan.valueOf(
                    request.getPlan().toUpperCase()
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid plan: " + request.getPlan()
            );

        }

        // Already subscribed to this plan
        if (tenant.getPlan() == newPlan) {

            throw new RuntimeException(
                    "You are already subscribed to the " + newPlan + " plan."
            );

        }

        // Enterprise plans can only be assigned by the Super Admin
        if (newPlan == Tenant.Plan.ENTERPRISE) {

            throw new RuntimeException(
                    "Enterprise plans can only be assigned by the Super Admin."
            );

        }

        // Update tenant plan
        tenant.setPlan(newPlan);
        tenantRepository.save(tenant);

        // Get or create subscription
        Subscription subscription = subscriptionRepository
                .findByTenant(tenant)
                .orElseGet(() -> createDefaultSubscription(tenant));

        // Reactivate subscription if needed
        subscription.setStatus(Subscription.Status.ACTIVE);
        subscription.setCancelAtPeriodEnd(false);

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
        subscriptionRepository.save(subscription);

        return toResponse(subscription);
    }

    @Transactional
    public SubscriptionResponse cancelSubscription() {
        Tenant tenant = currentTenant();
        Subscription subscription = subscriptionRepository.findByTenant(tenant)
                .orElseThrow(() -> new RuntimeException("No active subscription found"));

        // Mock behavior: stays active until the end of the current period, like Stripe's default.
        subscription.setCancelAtPeriodEnd(true);
        subscriptionRepository.save(subscription);

        return toResponse(subscription);
    }

    @Transactional
    public PaymentMethodResponse addPaymentMethod(PaymentMethodRequest request) {
        Tenant tenant = currentTenant();

        String lastFour = request.getCardNumber()
                .substring(request.getCardNumber().length() - 4);

        PaymentMethod paymentMethod = paymentMethodRepository.findByTenant(tenant)
                .orElse(PaymentMethod.builder().tenant(tenant).build());

        paymentMethod.setCardLastFour(lastFour);
        paymentMethod.setCardBrand(request.getCardBrand().toUpperCase());
        paymentMethod.setMockToken("mock_tok_" + UUID.randomUUID());
        paymentMethod.setAddedAt(LocalDateTime.now());

        paymentMethodRepository.save(paymentMethod);

        return PaymentMethodResponse.builder()
                .cardBrand(paymentMethod.getCardBrand())
                .cardLastFour(paymentMethod.getCardLastFour())
                .addedAt(paymentMethod.getAddedAt())
                .build();
    }

    @Transactional
    public PaymentMethodResponse getMyPaymentMethod() {
        Tenant tenant = currentTenant();
        PaymentMethod paymentMethod = paymentMethodRepository.findByTenant(tenant)
                .orElseThrow(() -> new RuntimeException("No payment method on file"));

        return PaymentMethodResponse.builder()
                .cardBrand(paymentMethod.getCardBrand())
                .cardLastFour(paymentMethod.getCardLastFour())
                .addedAt(paymentMethod.getAddedAt())
                .build();
    }

    @Transactional
    public List<InvoiceResponse> getMyInvoices() {
        Tenant tenant = currentTenant();
        return invoiceRepository.findByTenantOrderByIssuedAtDesc(tenant)
                .stream().map(this::toInvoiceResponse).collect(Collectors.toList());
    }

    // SUPER_ADMIN: invoices across every tenant
    @Transactional
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAllByOrderByIssuedAtDesc()
                .stream().map(this::toInvoiceResponse).collect(Collectors.toList());
    }

    // Called by BillingCycleScheduler once a subscription's period has ended.
    @Transactional
    public void runBillingCycleFor(Subscription subscription) {
        Tenant tenant = subscription.getTenant();

        if (subscription.isCancelAtPeriodEnd()) {
            subscription.setStatus(Subscription.Status.CANCELED);
            tenant.setPlan(Tenant.Plan.FREE);
            tenantRepository.save(tenant);
            subscriptionRepository.save(subscription);
            return;
        }

        long callCount = apiUsageLogRepository
                .countByTenantAndCalledAtBetween(
                        tenant,
                        subscription.getCurrentPeriodStart(),
                        subscription.getCurrentPeriodEnd()
                );
        // NOTE: countByUserEmailSince filters by user email; a tenant-wide count method
        // (e.g. countByTenantAndCalledAtBetween) should be added to ApiUsageLogRepository
        // for accurate per-tenant usage billing. Left as a follow-up.

        BigDecimal basePrice = basePriceFor(tenant.getPlan());
        BigDecimal usageAmount = tenant.getPlan() == Tenant.Plan.FREE
                ? BigDecimal.ZERO
                : PRICE_PER_CALL.multiply(BigDecimal.valueOf(callCount));

        Invoice invoice = Invoice.builder()
                .tenant(tenant)
                .baseAmount(basePrice)
                .usageAmount(usageAmount.setScale(2, RoundingMode.HALF_UP))
                .totalAmount(basePrice.add(usageAmount).setScale(2, RoundingMode.HALF_UP))
                .apiCallCount(callCount)
                .status(Invoice.Status.PAID) // mock: always succeeds
                .periodStart(subscription.getCurrentPeriodStart())
                .periodEnd(subscription.getCurrentPeriodEnd())
                .build();

        invoiceRepository.save(invoice);

        // Roll the period forward
        LocalDateTime newStart = subscription.getCurrentPeriodEnd();
        LocalDateTime newEnd = subscription.getBillingCycle() == Subscription.BillingCycle.ANNUAL
                ? newStart.plusYears(1)
                : newStart.plusMonths(1);

        subscription.setCurrentPeriodStart(newStart);
        subscription.setCurrentPeriodEnd(newEnd);
        subscriptionRepository.save(subscription);
    }

    private Subscription createDefaultSubscription(Tenant tenant) {
        return subscriptionRepository.save(
                Subscription.builder().tenant(tenant).build());
    }

    private BigDecimal basePriceFor(Tenant.Plan plan) {
        return switch (plan) {
            case FREE -> FREE_PRICE;
            case BASIC -> BASIC_PRICE;
            case PRO -> PRO_PRICE;
            case ENTERPRISE -> ENTERPRISE_PRICE;
        };
    }

    private SubscriptionResponse toResponse(Subscription subscription) {
        return SubscriptionResponse.builder()
                .plan(subscription.getTenant().getPlan().name())
                .status(subscription.getStatus().name())
                .billingCycle(subscription.getBillingCycle().name())
                .currentPeriodStart(subscription.getCurrentPeriodStart())
                .currentPeriodEnd(subscription.getCurrentPeriodEnd())
                .cancelAtPeriodEnd(subscription.isCancelAtPeriodEnd())
                .build();
    }

    private InvoiceResponse toInvoiceResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .tenantName(invoice.getTenant().getName())
                .baseAmount(invoice.getBaseAmount())
                .usageAmount(invoice.getUsageAmount())
                .totalAmount(invoice.getTotalAmount())
                .apiCallCount(invoice.getApiCallCount())
                .status(invoice.getStatus().name())
                .periodStart(invoice.getPeriodStart())
                .periodEnd(invoice.getPeriodEnd())
                .issuedAt(invoice.getIssuedAt())
                .build();
    }
}