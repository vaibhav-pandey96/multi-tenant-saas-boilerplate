package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Subscription;
import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByTenant(Tenant tenant);
    List<Subscription> findByCurrentPeriodEndBeforeAndStatus(
            java.time.LocalDateTime cutoff, Subscription.Status status);
}