package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.ApiUsageLog;
import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

public interface ApiUsageLogRepository extends JpaRepository<ApiUsageLog, Long> {

    // Total API calls for a tenant
    long countByTenant(Tenant tenant);

    // API calls within a time period
    long countByTenantAndCalledAtBetween(
            Tenant tenant,
            LocalDateTime start,
            LocalDateTime end
    );

    // Delete all logs belonging to a user
    @Transactional
    void deleteByUser(User user);
<<<<<<< HEAD
=======
    
    @Transactional
    void deleteByTenant(Tenant tenant);
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
}