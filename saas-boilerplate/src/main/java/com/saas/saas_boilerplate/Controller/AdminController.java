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
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    // Get all users in THIS admin's tenant only
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getUsersInMyTenant() {
        return ResponseEntity.ok(adminService.getUsersInMyTenant());
    }

    // Get a specific user by ID (must be in same tenant)
    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserByIdInMyTenant(id));
    }

    // Promote a user to ADMIN role
    @PutMapping("/users/{id}/make-admin")
    public ResponseEntity<UserProfileResponse> makeAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.changeUserRole(id, "ADMIN"));
    }

    // Demote an ADMIN back to USER role
    @PutMapping("/users/{id}/make-user")
    public ResponseEntity<UserProfileResponse> makeUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.changeUserRole(id, "USER"));
    }

    // Delete a user from tenant
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUserFromTenant(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}