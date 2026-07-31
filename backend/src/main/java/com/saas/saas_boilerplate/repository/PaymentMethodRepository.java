package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.PaymentMethod;
import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    Optional<PaymentMethod> findByTenant(Tenant tenant);
}