package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByName(String name);
    boolean existsByName(String name);
}