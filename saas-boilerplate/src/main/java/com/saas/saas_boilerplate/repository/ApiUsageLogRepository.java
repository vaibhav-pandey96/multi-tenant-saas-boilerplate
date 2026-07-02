package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.ApiUsageLog;
import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ApiUsageLogRepository extends JpaRepository<ApiUsageLog, Long> {

    // Count how many requests a user made in the last minute (for rate limiting)
    @Query("SELECT COUNT(a) FROM ApiUsageLog a WHERE a.user.email = :email AND a.calledAt >= :since")
    long countByUserEmailSince(@Param("email") String email, @Param("since") LocalDateTime since);

    // All logs for a tenant (for ADMIN/SUPER_ADMIN usage view)
    List<ApiUsageLog> findByTenantOrderByCalledAtDesc(Tenant tenant);

    // All logs (SUPER_ADMIN)
    List<ApiUsageLog> findAllByOrderByCalledAtDesc();
}