
package com.saas.saas_boilerplate.service;

import com.saas.saas_boilerplate.model.*;
import com.saas.saas_boilerplate.repository.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.saas.saas_boilerplate.dto.ChangePlanRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.mockito.ArgumentCaptor;

@ExtendWith(MockitoExtension.class)
class BillingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private PaymentMethodRepository paymentMethodRepository;

    @Mock
    private ApiUsageLogRepository apiUsageLogRepository;

    @InjectMocks
    private BillingService billingService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldReturnExistingSubscription() {

        // Arrange: Create test data
        Tenant tenant = Tenant.builder()
                .name("Test Company")
                .plan(Tenant.Plan.BASIC)
                .build();

        User user = User.builder()
                .email("admin@test.com")
                .tenant(tenant)
                .build();

        Subscription subscription = Subscription.builder()
                .tenant(tenant)
                .status(Subscription.Status.ACTIVE)
                .build();

        // Mock the logged-in user
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "admin@test.com", null
                )
        );

        // Mock repository responses
        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        when(subscriptionRepository.findByTenant(tenant))
                .thenReturn(Optional.of(subscription));

        // Act: Call the actual service method
        var response = billingService.getMySubscription();

        // Assert: Verify the result
        assertNotNull(response);
        assertEquals("BASIC", response.getPlan());
        assertEquals("ACTIVE", response.getStatus());

        // Verify repository interactions
        verify(userRepository).findByEmail("admin@test.com");
        verify(subscriptionRepository).findByTenant(tenant);
        verify(subscriptionRepository, never()).save(any());
    }
    
    // Test 2
    
    @Test
    void shouldCreateDefaultSubscriptionWhenNoSubscriptionExists() {

        // Arrange: Create a tenant
        Tenant tenant = Tenant.builder()
                .name("New Company")
                .plan(Tenant.Plan.BASIC)
                .build();

        User user = User.builder()
                .email("admin@test.com")
                .tenant(tenant)
                .build();

        // Set the logged-in user
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "admin@test.com", null
                )
        );

        // Mock user repository
        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        // Pretend that this tenant has no subscription
        when(subscriptionRepository.findByTenant(tenant))
                .thenReturn(Optional.empty());

        // When save() is called, return the same subscription
        when(subscriptionRepository.save(any(Subscription.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act: Call the actual service method
        var response = billingService.getMySubscription();

        // Assert: Check the response
        assertNotNull(response);
        assertEquals("BASIC", response.getPlan());
        assertEquals("ACTIVE", response.getStatus());
        assertEquals("MONTHLY", response.getBillingCycle());
        assertFalse(response.isCancelAtPeriodEnd());

        // Verify that a new subscription was saved
        verify(subscriptionRepository).save(any(Subscription.class));
    }
    
    // Test 3
    @Test
    void shouldChangeSubscriptionPlanSuccessfully() {

        // Arrange: Create a tenant currently on BASIC plan
        Tenant tenant = Tenant.builder()
                .name("Test Company")
                .plan(Tenant.Plan.BASIC)
                .build();

        User user = User.builder()
                .email("admin@test.com")
                .tenant(tenant)
                .build();

        // Existing subscription is cancelled but not yet renewed
        Subscription subscription = Subscription.builder()
                .tenant(tenant)
                .status(Subscription.Status.CANCELED)
                .cancelAtPeriodEnd(true)
                .build();

        // Set logged-in user
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "admin@test.com", null
                )
        );

        // Mock user repository
        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        // Mock existing subscription
        when(subscriptionRepository.findByTenant(tenant))
                .thenReturn(Optional.of(subscription));

        // Prepare change plan request
        ChangePlanRequest request = new ChangePlanRequest();
        request.setPlan("PRO");

        // Act: Change BASIC to PRO
        var response = billingService.changePlan(request);

        // Assert: Verify updated plan
        assertEquals(Tenant.Plan.PRO, tenant.getPlan());
        assertEquals("PRO", response.getPlan());

        // Assert: Verify subscription reactivated
        assertEquals(Subscription.Status.ACTIVE, subscription.getStatus());
        assertEquals("ACTIVE", response.getStatus());

        // Assert: Cancellation flag should be reset
        assertFalse(subscription.isCancelAtPeriodEnd());
        assertFalse(response.isCancelAtPeriodEnd());

        // Verify database save operations
        verify(tenantRepository).save(tenant);
        verify(subscriptionRepository).save(subscription);
    }
    
    // Test 4
    

@Test
void shouldRejectInvalidSubscriptionPlan() {

    // Arrange: Create a tenant
    Tenant tenant = Tenant.builder()
            .name("Test Company")
            .plan(Tenant.Plan.BASIC)
            .build();

    User user = User.builder()
            .email("admin@test.com")
            .tenant(tenant)
            .build();

    // Set logged-in user
    SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(
                    "admin@test.com", null
            )
    );

    when(userRepository.findByEmail("admin@test.com"))
            .thenReturn(Optional.of(user));

    // Send an invalid plan
    ChangePlanRequest request = new ChangePlanRequest();
    request.setPlan("GOLD");

    // Act & Assert: Expect an exception
    RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> billingService.changePlan(request)
    );

    // Verify exception message
    assertEquals("Invalid plan: GOLD", exception.getMessage());

    // Verify no database changes were made
    verify(tenantRepository, never()).save(any());
    verify(subscriptionRepository, never()).save(any());
   }

// Test 5
@Test
void shouldCancelSubscriptionSuccessfully() {

    // Arrange: Create tenant
    Tenant tenant = Tenant.builder()
            .name("Test Company")
            .plan(Tenant.Plan.PRO)
            .build();

    User user = User.builder()
            .email("admin@test.com")
            .tenant(tenant)
            .build();

    Subscription subscription = Subscription.builder()
            .tenant(tenant)
            .status(Subscription.Status.ACTIVE)
            .cancelAtPeriodEnd(false)
            .build();

    // Set logged-in user
    SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(
                    "admin@test.com", null
            )
    );

    // Mock repository responses
    when(userRepository.findByEmail("admin@test.com"))
            .thenReturn(Optional.of(user));

    when(subscriptionRepository.findByTenant(tenant))
            .thenReturn(Optional.of(subscription));

    // Act
    billingService.cancelSubscription();

    // Assert
    assertTrue(subscription.isCancelAtPeriodEnd());

    // Subscription should remain active until period ends
    assertEquals(
            Subscription.Status.ACTIVE,
            subscription.getStatus()
    );

    // Verify subscription was saved
    verify(subscriptionRepository).save(subscription);
}

// Test 6

@Test
void shouldGenerateInvoiceAndRenewBillingPeriod() {

    // Arrange
    Tenant tenant = Tenant.builder()
            .name("Test Company")
            .plan(Tenant.Plan.PRO)
            .build();

    LocalDateTime periodStart =
            LocalDateTime.of(2026, 10, 1, 0, 0);

    LocalDateTime periodEnd =
            LocalDateTime.of(2026, 11, 1, 0, 0);

    Subscription subscription = Subscription.builder()
            .tenant(tenant)
            .status(Subscription.Status.ACTIVE)
            .billingCycle(Subscription.BillingCycle.MONTHLY)
            .currentPeriodStart(periodStart)
            .currentPeriodEnd(periodEnd)
            .cancelAtPeriodEnd(false)
            .build();

    when(apiUsageLogRepository.countByTenantAndCalledAtBetween(
            tenant, periodStart, periodEnd
    )).thenReturn(0L);

    // Act
    billingService.runBillingCycleFor(subscription);

    // Capture the invoice passed to save()
    ArgumentCaptor<Invoice> invoiceCaptor =
            ArgumentCaptor.forClass(Invoice.class);

    verify(invoiceRepository).save(invoiceCaptor.capture());

    Invoice savedInvoice = invoiceCaptor.getValue();

    // Assert: Invoice details
    assertEquals(tenant, savedInvoice.getTenant());
    assertEquals(new BigDecimal("99.00"), savedInvoice.getBaseAmount());
    assertEquals(new BigDecimal("0.00"), savedInvoice.getUsageAmount());
    assertEquals(new BigDecimal("99.00"), savedInvoice.getTotalAmount());
    assertEquals(0L, savedInvoice.getApiCallCount());
    assertEquals(Invoice.Status.PAID, savedInvoice.getStatus());

    // Assert: Billing period has moved forward by one month
    assertEquals(periodEnd, subscription.getCurrentPeriodStart());
    assertEquals(periodEnd.plusMonths(1),
            subscription.getCurrentPeriodEnd());

    verify(subscriptionRepository).save(subscription);
}

// Test 7


@Test
void shouldCalculateUsageBasedChargesCorrectly() {

    // Arrange
    Tenant tenant = Tenant.builder()
            .name("Test Company")
            .plan(Tenant.Plan.PRO)
            .build();

    LocalDateTime periodStart =
            LocalDateTime.of(2026, 10, 1, 0, 0);

    LocalDateTime periodEnd =
            LocalDateTime.of(2026, 11, 1, 0, 0);

    Subscription subscription = Subscription.builder()
            .tenant(tenant)
            .billingCycle(Subscription.BillingCycle.MONTHLY)
            .currentPeriodStart(periodStart)
            .currentPeriodEnd(periodEnd)
            .cancelAtPeriodEnd(false)
            .build();

    when(apiUsageLogRepository.countByTenantAndCalledAtBetween(
            tenant, periodStart, periodEnd
    )).thenReturn(5000L);

    // Act
    billingService.runBillingCycleFor(subscription);

    // Capture generated invoice
    ArgumentCaptor<Invoice> invoiceCaptor =
            ArgumentCaptor.forClass(Invoice.class);

    verify(invoiceRepository).save(invoiceCaptor.capture());

    Invoice invoice = invoiceCaptor.getValue();

    // Assert: Usage calculation
    assertEquals(5000L, invoice.getApiCallCount());

    assertEquals(
            new BigDecimal("5.00"),
            invoice.getUsageAmount()
    );

    // Assert: Total = Base price + Usage charges
    assertEquals(
            new BigDecimal("104.00"),
            invoice.getTotalAmount()
    );
}


}
