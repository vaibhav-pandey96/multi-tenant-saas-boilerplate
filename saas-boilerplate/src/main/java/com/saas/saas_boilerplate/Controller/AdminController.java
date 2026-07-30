package com.saas.saas_boilerplate.Controller;

import com.saas.saas_boilerplate.dto.UserProfileResponse;
import com.saas.saas_boilerplate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Get all users in the logged-in admin's tenant
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getUsersInMyTenant() {

        return ResponseEntity.ok(
                adminService.getUsersInMyTenant()
        );
    }

    // Get a specific user in the same tenant
    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getUserByIdInMyTenant(id)
        );
    }

    // Promote a user to ADMIN within the same tenant
    @PutMapping("/users/{id}/make-admin")
    public ResponseEntity<UserProfileResponse> makeAdmin(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.changeUserRoleInMyTenant(id, "ADMIN")
        );
    }

    // Demote an ADMIN back to USER within the same tenant
    @PutMapping("/users/{id}/make-user")
    public ResponseEntity<UserProfileResponse> makeUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.changeUserRoleInMyTenant(id, "USER")
        );
    }

    // Delete a user from the same tenant
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        adminService.deleteUserFromTenant(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}