package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Subscription;
import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
=======
import org.springframework.transaction.annotation.Transactional;

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByTenant(Tenant tenant);
    List<Subscription> findByCurrentPeriodEndBeforeAndStatus(
            java.time.LocalDateTime cutoff, Subscription.Status status);
<<<<<<< HEAD
=======
    
    @Transactional
    void deleteByTenant(Tenant tenant);
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
}