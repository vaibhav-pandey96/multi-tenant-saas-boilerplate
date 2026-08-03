package com.saas.saas_boilerplate.repository;

import com.saas.saas_boilerplate.model.Invoice;
import com.saas.saas_boilerplate.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
=======
import org.springframework.transaction.annotation.Transactional;

>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByTenantOrderByIssuedAtDesc(Tenant tenant);
    List<Invoice> findAllByOrderByIssuedAtDesc();
<<<<<<< HEAD
=======
    
    @Transactional
    void deleteByTenant(Tenant tenant);
>>>>>>> 928b97b65af459d38d56d50e693e3d7afcacc135
}