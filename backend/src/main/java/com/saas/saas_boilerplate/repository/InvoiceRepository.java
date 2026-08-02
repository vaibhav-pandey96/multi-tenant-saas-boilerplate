package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Invoice;
import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByTenantOrderByIssuedAtDesc(Tenant tenant);
    List<Invoice> findAllByOrderByIssuedAtDesc();
    
    @Transactional
    void deleteByTenant(Tenant tenant);
}