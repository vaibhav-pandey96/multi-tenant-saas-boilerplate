package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.TenantSummaryResponse;
import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.repository.TenantRepository;
import com.saas.saas_boilerplate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/superadmin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final AdminService adminService;
    private final TenantRepository tenantRepository;

    // ==========================================================
    // PUBLIC API
    // Used during Registration
    // ==========================================================

    @GetMapping("/tenant-names")
    public ResponseEntity<List<String>> getAllTenantNames() {

        List<String> names = tenantRepository
                .findAllByOrderByNameAsc()
                .stream()
                .map(Tenant::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(names);
    }

    // ==========================================================
    // SUPER ADMIN ONLY
    // ==========================================================

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/tenants")
    public ResponseEntity<List<TenantSummaryResponse>> getAllTenants() {

        return ResponseEntity.ok(
                adminService.getAllTenantsWithUsage()
        );
    }

}