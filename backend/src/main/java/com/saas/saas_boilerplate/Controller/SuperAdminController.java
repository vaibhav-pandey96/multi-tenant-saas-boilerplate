package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.ChangeCompanyStatusRequest;
import com.saas.saas_boilerplate.dto.ChangePlanRequest;
import com.saas.saas_boilerplate.dto.CompanyDetailsResponse;
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

    // Dashboard
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/tenants")
    public ResponseEntity<List<TenantSummaryResponse>> getAllTenants() {

        return ResponseEntity.ok(
                adminService.getAllTenantsWithUsage()
        );
    }

    // Company Details
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/company/{id}")
    public ResponseEntity<CompanyDetailsResponse> getCompanyDetails(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getCompanyDetails(id)
        );
    }
    
 // Change Company Plan
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/company/{id}/plan")
    public ResponseEntity<CompanyDetailsResponse> changeCompanyPlan(
            @PathVariable Long id,
            @RequestBody ChangePlanRequest request) {

        return ResponseEntity.ok(
                adminService.changeCompanyPlan(id, request)
        );
    }
    
 // Change Company Status
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/company/{id}/status")
    public ResponseEntity<CompanyDetailsResponse> changeCompanyStatus(
            @PathVariable Long id,
            @RequestBody ChangeCompanyStatusRequest request) {

        return ResponseEntity.ok(
                adminService.changeCompanyStatus(id, request)
        );
    }
    
 // Delete Company
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/company/{id}")
    public ResponseEntity<String> deleteCompany(
            @PathVariable Long id) {

        adminService.deleteCompany(id);

        return ResponseEntity.ok("Company deleted successfully.");
    }

}