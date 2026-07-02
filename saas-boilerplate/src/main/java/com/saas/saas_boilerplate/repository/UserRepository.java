package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByVerificationToken(String token);
    List<User> findByTenant(Tenant tenant);
}