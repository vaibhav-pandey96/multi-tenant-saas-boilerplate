package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.model.TenantContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TenantContentRepository extends JpaRepository<TenantContent, Long> {

    List<TenantContent> findByTenantOrderByCreatedAtDesc(Tenant tenant);
}
