package com.saas.saas_boilerplate.billing;

import com.saas.saas_boilerplate.model.Subscription;
import com.saas.saas_boilerplate.repository.SubscriptionRepository;
import com.saas.saas_boilerplate.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BillingCycleScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final BillingService billingService;

    // Runs hourly and bills any subscription whose current period has ended.
    // In a real system this would be daily/nightly; hourly makes it easy to
    // demo the mock billing cycle without waiting a full month.
    @Scheduled(fixedRate = 3_600_000)
    public void runDueBillingCycles() {
        List<Subscription> due = subscriptionRepository
                .findByCurrentPeriodEndBeforeAndStatus(LocalDateTime.now(), Subscription.Status.ACTIVE);

        for (Subscription subscription : due) {
            billingService.runBillingCycleFor(subscription);
        }
    }
}