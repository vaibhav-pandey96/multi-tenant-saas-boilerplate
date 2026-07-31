package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.TenantSummaryResponse;
import com.saas.saas_boilerplate.dto.UserProfileResponse;
import com.saas.saas_boilerplate.model.Tenant;
import com.saas.saas_boilerplate.repository.TenantRepository;
import com.saas.saas_boilerplate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/superadmin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final AdminService adminService;
    private final TenantRepository tenantRepository;

    // Get all tenants
    @GetMapping("/tenants")
    public ResponseEntity<List<TenantSummaryResponse>> getAllTenants() {

        return ResponseEntity.ok(
                adminService.getAllTenantsWithUsage()
        );
    }

    // Get tenant names
    @GetMapping("/tenant-names")
    public ResponseEntity<List<String>> getAllTenantNames() {

        List<String> names = tenantRepository
                .findAllByOrderByNameAsc()
                .stream()
                .map(Tenant::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(names);
    }

    // Promote user to Tenant Admin
    @PutMapping("/users/{id}/make-tenant-admin")
    public ResponseEntity<UserProfileResponse> makeTenantAdmin(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.changeUserRoleAsSuperAdmin(id, "ADMIN")
        );
    }

    // Demote Tenant Admin to User
    @PutMapping("/users/{id}/make-user")
    public ResponseEntity<UserProfileResponse> makeUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.changeUserRoleAsSuperAdmin(id, "USER")
        );
    }

    // Get users of a tenant
    @GetMapping("/tenants/{tenantId}/users")
    public ResponseEntity<List<UserProfileResponse>> getUsersOfTenant(
            @PathVariable Long tenantId) {

        return ResponseEntity.ok(
                adminService.getUsersByTenantId(tenantId)
        );
    }
}