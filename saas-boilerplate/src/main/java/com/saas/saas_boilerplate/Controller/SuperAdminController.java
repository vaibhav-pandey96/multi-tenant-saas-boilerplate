package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.TenantSummaryResponse;
import com.saas.saas_boilerplate.dto.UserProfileResponse;
import com.saas.saas_boilerplate.service.AdminService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/superadmin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SuperAdminController {

    private final AdminService adminService;

    // Get all tenants with usage stats (SUPER_ADMIN only)
    @GetMapping("/tenants")
    public ResponseEntity<List<TenantSummaryResponse>> getAllTenants() {
        return ResponseEntity.ok(adminService.getAllTenantsWithUsage());
    }

    // Get all users in system (SUPER_ADMIN only)
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
}