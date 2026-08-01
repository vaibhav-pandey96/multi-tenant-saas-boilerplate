package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.UserProfileResponse;
import com.saas.saas_boilerplate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ==================================================
    // USER MANAGEMENT (Current Tenant Only)
    // ==================================================

    // Get all users of my tenant
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getUsersInMyTenant() {

        return ResponseEntity.ok(
                adminService.getUsersInMyTenant()
        );
    }

    // Get one user of my tenant
    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getUserByIdInMyTenant(id)
        );
    }

    // Transfer Tenant Admin ownership
    @PutMapping("/transfer-admin/{id}")
    public ResponseEntity<UserProfileResponse> transferAdminRights(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.transferAdminRights(id)
        );
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        adminService.deleteUserFromTenant(id);

        return ResponseEntity.ok(
                "User deleted successfully."
        );
    }
}