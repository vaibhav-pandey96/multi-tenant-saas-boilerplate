package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.PaymentMethod;
import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
=======
import org.springframework.transaction.annotation.Transactional;

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    Optional<PaymentMethod> findByTenant(Tenant tenant);
<<<<<<< HEAD
=======
    
    @Transactional
    void deleteByTenant(Tenant tenant);
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
}