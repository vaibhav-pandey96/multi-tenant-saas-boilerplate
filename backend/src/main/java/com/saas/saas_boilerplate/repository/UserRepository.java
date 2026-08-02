package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByVerificationToken(String token);

    List<User> findByTenant(Tenant tenant);

    // Get all admins of a tenant
    List<User> findByTenantAndRole(Tenant tenant, User.Role role);

    // Count admins of a tenant
    long countByTenantAndRole(Tenant tenant, User.Role role);
    
    @Transactional
    void deleteByTenant(Tenant tenant);
}